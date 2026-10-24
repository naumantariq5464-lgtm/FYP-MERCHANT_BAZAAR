"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthModal } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openSignIn, openSignUp } = useAuthModal();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  // Lock background scroll when mobile curtain menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="landing-navbar">
        <div className="landing-navbar-container">
          {/* Left Corner: Brand Logo (Unboxed, prominent) & Name */}
          <Link href="/" className="landing-navbar-brand">
            <Image
              src="/logo.png"
              alt="Merchant Bazaar"
              width={48}
              height={48}
              className="landing-navbar-logo"
              priority
            />
            <div className="landing-navbar-brand-text">
              <div className="landing-brand-name">
                <span className="brand-word-merchant">Merchant</span>
                <span className="brand-word-bazaar">Bazaar</span>
              </div>
            </div>
          </Link>

          {/* Right Corner: Desktop Navigation Links & Action Buttons */}
          <div className="landing-navbar-right">
            {/* Desktop Action Buttons */}
            <div className="landing-navbar-actions">
              <Link href="/docs" className="landing-nav-link">
                Docs
              </Link>
              <a href="/#pricing" className="landing-nav-link">
                Pricing
              </a>
              {isAuthenticated ? (
                <>
                  <Link
                    href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                    className="btn btn-primary btn-sm"
                  >
                    {isAdmin ? "Admin Console" : "Dashboard"}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginLeft: "6px" }}
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="btn btn-ghost btn-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={openSignIn}
                    className="btn btn-ghost btn-sm"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={openSignUp}
                    className="btn btn-primary btn-sm"
                  >
                    Create Your Store
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginLeft: "6px" }}
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Mobile / Tablet Hamburger Button */}
            <button
              type="button"
              className="landing-hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              suppressHydrationWarning
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                suppressHydrationWarning
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Curtain Dropdown Mobile / Tablet Menu */}
      {mobileMenuOpen && (
        <div className="curtain-menu-overlay" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div className="curtain-menu-container">
            {/* Top Bar with Brand on Left & Close Button on Right */}
            <div className="curtain-menu-header">
              <Link href="/" className="landing-navbar-brand" onClick={closeMenu}>
                <Image
                  src="/logo.png"
                  alt="Merchant Bazaar"
                  width={42}
                  height={42}
                  className="landing-navbar-logo"
                />
                <div className="landing-navbar-brand-text">
                  <div className="landing-brand-name">
                    <span className="brand-word-merchant">Merchant</span>
                    <span className="brand-word-bazaar">Bazaar</span>
                  </div>
                </div>
              </Link>

              <button
                type="button"
                className="curtain-close-btn"
                onClick={closeMenu}
                aria-label="Close mobile navigation menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Navigation Links with smooth curtain dividers */}
            <nav className="curtain-nav-links">
              <Link href="/docs" className="curtain-nav-item" onClick={closeMenu}>
                <span>Docs</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
              <a href="/#pricing" className="curtain-nav-item" onClick={closeMenu}>
                <span>Pricing</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
            </nav>

            {/* Bottom Actions */}
            <div className="curtain-actions">
              {isAuthenticated ? (
                <>
                  <Link
                    href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                    className="btn btn-primary btn-full curtain-btn-primary"
                    onClick={closeMenu}
                  >
                    {isAdmin ? "Super Admin Console" : "Seller Dashboard"}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                  <button
                    type="button"
                    className="btn btn-secondary btn-full curtain-btn-secondary"
                    onClick={() => {
                      closeMenu();
                      logout();
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-primary btn-full curtain-btn-primary"
                    onClick={() => {
                      closeMenu();
                      openSignUp();
                    }}
                  >
                    Create Your Store
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-full curtain-btn-secondary"
                    onClick={() => {
                      closeMenu();
                      openSignIn();
                    }}
                  >
                    Sign In to Account
                  </button>
                </>
              )}
              <div className="curtain-tagline-footer">
                Your Storefront · Your Products · Your Business
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
