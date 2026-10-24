"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: "signin" | "signup";
  onClose: () => void;
  onSwitchMode?: (mode: "signin" | "signup") => void;
}

export default function AuthModal({
  isOpen,
  initialMode = "signin",
  onClose,
  onSwitchMode,
}: AuthModalProps) {
  const router = useRouter();
  const { login } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  // Sign In fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign Up fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync mode with prop when it changes
  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, isOpen]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSwitch = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setError(null);
    if (onSwitchMode) onSwitchMode(newMode);
  };

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStoreName(val);
    const suggested = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setStoreSlug(suggested);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setStoreSlug(clean);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail.trim() || !loginPassword) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: loginEmail.trim(),
        password: loginPassword,
      });

      const { access_token, role } = res.data;
      login(access_token);
      onClose();

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Invalid email address or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password || !storeName.trim() || !storeSlug.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        store_name: storeName.trim(),
        store_slug: storeSlug.trim(),
      });

      const { access_token } = res.data;
      login(access_token);
      onClose();
      router.push("/dashboard");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d: any) => d.msg).join(", "));
      } else {
        setError("Registration failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={`auth-modal-card ${mode === "signup" ? "auth-modal-wide" : ""}`}>
        {/* Close Button */}
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Brand Header (Unboxed Logo) */}
        <div className="auth-modal-header">
          <div className="auth-modal-brand">
            <Image
              src="/logo.png"
              alt="Merchant Bazaar"
              width={46}
              height={46}
              className="auth-modal-logo"
              priority
            />
            <div className="auth-modal-brand-text">
              <span className="auth-modal-brand-name">
                Merchant<span style={{ color: "var(--color-primary)" }}>Bazaar</span>
              </span>
            </div>
          </div>

          <h2 className="auth-modal-title">
            {mode === "signin" ? "Sign In to Your Store" : "Create Your Merchant Store"}
          </h2>
          <p className="auth-modal-subtitle">
            {mode === "signin"
              ? "Access your store dashboard, inventory, and order management."
              : "Launch your independent storefront on a dedicated subdomain in seconds."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: "16px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === "signin" ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="modalLoginEmail">
                Email Address
              </label>
              <input
                id="modalLoginEmail"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modalLoginPassword">
                Password
              </label>
              <input
                id="modalLoginPassword"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: "8px" }}
            >
              {loading ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></span>
                  Signing In...
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>

            <div className="auth-modal-footer">
              <p>
                Don&apos;t have an online store yet?{" "}
                <button
                  type="button"
                  onClick={() => handleSwitch("signup")}
                  className="auth-modal-switch-btn"
                >
                  Create Your Store
                </button>
              </p>
            </div>
          </form>
        ) : (
          /* SIGN UP FORM — Horizontal / Expanded 2-Column Registration */
          <form onSubmit={handleSignupSubmit} className="auth-form">
            <div className="auth-modal-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="modalSignupName">
                  Full Name
                </label>
                <input
                  id="modalSignupName"
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modalSignupEmail">
                  Email Address
                </label>
                <input
                  id="modalSignupEmail"
                  type="email"
                  className="form-input"
                  placeholder="merchant@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-modal-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="modalSignupStoreName">
                  Store Name
                </label>
                <input
                  id="modalSignupStoreName"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Urban Style Atelier"
                  value={storeName}
                  onChange={handleStoreNameChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modalSignupStoreSlug">
                  Dedicated Subdomain
                </label>
                <div className="slug-input-wrapper">
                  <input
                    id="modalSignupStoreSlug"
                    type="text"
                    className="form-input slug-input"
                    placeholder="urban-style"
                    value={storeSlug}
                    onChange={handleSlugChange}
                    required
                  />
                  <span className="slug-domain-suffix">.merchantbazaar.com</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modalSignupPassword">
                Password
              </label>
              <input
                id="modalSignupPassword"
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="form-hint" style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "4px", display: "block" }}>
                Live Store URL: <strong>https://{storeSlug || "your-store"}.merchantbazaar.com</strong>
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: "10px" }}
            >
              {loading ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></span>
                  Setting Up Your Store...
                </span>
              ) : (
                "Create Store & Launch Dashboard"
              )}
            </button>

            <div className="auth-modal-footer">
              <p>
                Already have an active store?{" "}
                <button
                  type="button"
                  onClick={() => handleSwitch("signin")}
                  className="auth-modal-switch-btn"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
