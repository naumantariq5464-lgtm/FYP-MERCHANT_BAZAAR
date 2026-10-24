import Cookies from "js-cookie";

const TOKEN_KEY = "mb_token";
const TOKEN_EXPIRY_DAYS = 7;

export function saveToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    expires: TOKEN_EXPIRY_DAYS,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function removeToken(): void {
  Cookies.remove(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export interface TokenPayload {
  sub: string;       // user id
  email: string;
  role: "seller" | "admin";
  store_id?: string;
  exp: number;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as TokenPayload;
  } catch {
    return null;
  }
}

export function getCurrentUser(): TokenPayload | null {
  const token = getToken();
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  // Check expiry
  if (payload.exp * 1000 < Date.now()) {
    removeToken();
    return null;
  }
  return payload;
}
