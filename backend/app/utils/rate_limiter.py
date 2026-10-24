import time
import threading
from collections import defaultdict, deque
from fastapi import Request, HTTPException, status


class SlidingWindowRateLimiter:
    """
    High-performance, in-memory sliding window rate limiter.
    Zero external dependencies, thread-safe, and proxy-aware.
    Protects against brute force and DDoS attacks on auth endpoints.
    """

    def __init__(self):
        self._lock = threading.Lock()
        # Maps key -> deque of timestamp floats
        self._ip_history = defaultdict(deque)
        self._email_failures = defaultdict(deque)
        self._last_cleanup = time.time()

    def get_client_ip(self, request: Request) -> str:
        """
        Extract the actual client IP, handling proxies (Railway, Cloudflare, Netlify).
        """
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Take the first client IP in the chain
            ip = forwarded_for.split(",")[0].strip()
            if ip:
                return ip

        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip.strip()

        if request.client and request.client.host:
            return request.client.host.strip()

        return "127.0.0.1"

    def _cleanup_old_entries(self, current_time: float):
        """Periodically prune stale records to keep memory footprint minimal."""
        if current_time - self._last_cleanup < 300:  # Cleanup every 5 minutes
            return

        self._last_cleanup = current_time

        # Cleanup IP history older than 15 minutes
        stale_ip_keys = []
        for key, timestamps in self._ip_history.items():
            while timestamps and timestamps[0] < current_time - 900:
                timestamps.popleft()
            if not timestamps:
                stale_ip_keys.append(key)
        for key in stale_ip_keys:
            del self._ip_history[key]

        # Cleanup Email history older than 15 minutes
        stale_email_keys = []
        for key, timestamps in self._email_failures.items():
            while timestamps and timestamps[0] < current_time - 900:
                timestamps.popleft()
            if not timestamps:
                stale_email_keys.append(key)
        for key in stale_email_keys:
            del self._email_failures[key]

    def check_rate_limit(
        self,
        key: str,
        max_requests: int,
        window_seconds: int,
        error_message: str
    ):
        """
        Generic sliding window rate limiter check.
        Raises 429 if limit is exceeded.
        """
        now = time.time()
        with self._lock:
            self._cleanup_old_entries(now)
            timestamps = self._ip_history[key]

            # Remove timestamps outside the sliding window
            cutoff = now - window_seconds
            while timestamps and timestamps[0] < cutoff:
                timestamps.popleft()

            if len(timestamps) >= max_requests:
                oldest = timestamps[0]
                retry_after = max(1, int(window_seconds - (now - oldest)))
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=error_message,
                    headers={"Retry-After": str(retry_after)}
                )

            # Record this attempt
            timestamps.append(now)

    def check_auth_attempt(self, request: Request, email: str):
        """
        Dual-layer protection for Login/Register:
        1. IP-level limit: Max 10 auth requests per minute per IP.
        2. Account-level limit: Max 5 failed attempts per email in 5 minutes.
        """
        ip = self.get_client_ip(request)
        clean_email = email.lower().strip()
        now = time.time()

        with self._lock:
            self._cleanup_old_entries(now)

            # 1. IP Sliding Window (10 attempts per minute)
            ip_stamps = self._ip_history[f"ip:{ip}"]
            cutoff_ip = now - 60
            while ip_stamps and ip_stamps[0] < cutoff_ip:
                ip_stamps.popleft()

            if len(ip_stamps) >= 10:
                retry_after = max(1, int(60 - (now - ip_stamps[0])))
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Too many authentication attempts from this IP. Please wait {retry_after} seconds.",
                    headers={"Retry-After": str(retry_after)}
                )

            # 2. Email Sliding Window (5 failed attempts per 5 minutes)
            if clean_email:
                email_stamps = self._email_failures[f"email:{clean_email}"]
                cutoff_email = now - 300
                while email_stamps and email_stamps[0] < cutoff_email:
                    email_stamps.popleft()

                if len(email_stamps) >= 5:
                    retry_after = max(1, int(300 - (now - email_stamps[0])))
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail=f"Account temporarily locked due to too many failed attempts. Please retry in {retry_after // 60 + 1} minute(s).",
                        headers={"Retry-After": str(retry_after)}
                    )

            # Record attempt for IP
            ip_stamps.append(now)

    def record_failed_attempt(self, email: str):
        """Record a failed login password attempt for the email."""
        clean_email = email.lower().strip()
        if not clean_email:
            return
        now = time.time()
        with self._lock:
            self._email_failures[f"email:{clean_email}"].append(now)

    def record_successful_login(self, email: str):
        """Reset failed attempt counters on valid login."""
        clean_email = email.lower().strip()
        if not clean_email:
            return
        with self._lock:
            self._email_failures.pop(f"email:{clean_email}", None)


# Global singleton instance
rate_limiter = SlidingWindowRateLimiter()
