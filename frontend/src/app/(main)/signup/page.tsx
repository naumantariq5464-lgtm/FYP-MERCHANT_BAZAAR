"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from store name if user hasn't typed custom slug
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
    const clean = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    setStoreSlug(clean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="auth-page-container">
      <div className="auth-card auth-card-wide">
        {/* Header with Logo */}
        <div className="auth-header">
          <Link href="/" className="auth-brand-link">
            <Image
              src="/logo.png"
              alt="Merchant Bazaar"
              width={46}
              height={46}
              priority
            />
            <span className="auth-brand-name">
              Merchant<span style={{ color: "var(--color-primary)" }}>Bazaar</span>
            </span>
          </Link>
          <h1 className="auth-title">Create Your Merchant Store</h1>
          <p className="auth-subtitle">
            Launch your independent storefront on a dedicated subdomain in seconds.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: "var(--space-4)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form — Horizontal 2-Column Grid */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-modal-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
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
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
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
              <label className="form-label" htmlFor="storeName">Store Name</label>
              <input
                id="storeName"
                type="text"
                className="form-input"
                placeholder="e.g. Urban Style Atelier"
                value={storeName}
                onChange={handleStoreNameChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="storeSlug">Dedicated Subdomain</label>
              <div className="slug-input-wrapper">
                <input
                  id="storeSlug"
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
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Minimum 6 characters"
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
                Setting Up Store...
              </span>
            ) : (
              "Create Store & Launch Dashboard"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an active store?{" "}
            <Link href="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
