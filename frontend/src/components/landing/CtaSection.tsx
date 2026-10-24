"use client";

import React from "react";
import Link from "next/link";
import { useAuthModal } from "@/context/AuthModalContext";

export default function CtaSection() {
  const { openSignIn, openSignUp } = useAuthModal();

  return (
    <section className="landing-cta-banner-section">
      <div className="landing-cta-banner-container">
        <div className="landing-cta-box">
          <div className="landing-cta-content">
            <span style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#a7f3d0",
              marginBottom: "0.75rem"
            }}>
              YOUR BUSINESS. YOUR NEXT CHAPTER.
            </span>
            <h2 className="landing-cta-title">
              Build Your Store Today. Get Ready for Intelligent Commerce.
            </h2>
            <p className="landing-cta-subtitle">
              Bring your brand, products, and customer orders together in one place. Start with your own online store and move toward a smarter shopping and sales experience with Merchant Bazaar.
            </p>
            <div className="landing-cta-actions">
              <button
                type="button"
                onClick={openSignUp}
                className="btn btn-lg btn-cta-white"
              >
                Create Your Store
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: "8px" }}
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <button
                type="button"
                onClick={openSignIn}
                className="btn btn-lg btn-cta-outline"
              >
                Sign In to Your Dashboard
              </button>
            </div>
            <div style={{
              marginTop: "1.5rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#a7f3d0",
              letterSpacing: "0.02em"
            }}>
              Your Storefront. Your Products. Your Business.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
