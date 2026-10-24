"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthModal } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthContext";

const MARQUEE_PHRASES = [
  "THE FUTURE OF CONVERSATIONAL COMMERCE",
  "SHOP SMARTER. JUST ASK.",
  "REIMAGINING COMMERCE WITH AI",
  "YOUR NEXT-GENERATION AI SHOPPING EXPERIENCE",
  "FROM CLICKS TO CONVERSATIONS",
  "EMBRACE THE FUTURE OF AGENTIC COMMERCE",
  "WHERE AI MEETS EVERYDAY SHOPPING",
  "COMMERCE THAT UNDERSTANDS YOU",
];

export default function HeroSection() {
  const { openSignIn, openSignUp } = useAuthModal();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <section className="ref-hero-section">
      <div className="ref-hero-container">
        {/* Left Column: Heading, Description & Pill Actions */}
        <div className="ref-hero-left">
          <h1 className="ref-hero-title">Merchant Bazaar</h1>
          <h2 className="ref-hero-subtitle">AI-Powered Digital Stores</h2>

          <p className="ref-hero-description">
            Build and publish your branded online storefront in seconds. Empower
            your shoppers with real-time autonomous voice AI sales agents that
            listen, recommend products, and drive instant checkouts — completely
            hands-free.
          </p>

          {/* Action Buttons: Vibrant Pill Styles */}
          <div className="ref-hero-actions">
            {isAuthenticated ? (
              <>
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className="ref-btn-primary"
                >
                  {isAdmin ? "Super Admin Console" : "Go to Dashboard"}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="ref-btn-secondary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={openSignUp}
                  className="ref-btn-primary"
                >
                  Create Your Store
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
                <Link href="/docs" className="ref-btn-secondary">
                  Explore Docs
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Visual Device Showcase Matching Reference Illustration */}
        <div className="ref-hero-right">
          <div className="ref-device-composition">
            {/* 1. Left Character: Friendly Futuristic Robot Waving */}
            <div className="ref-character-col" aria-label="AI Sales Assistant">
              <div className="ref-voice-bubble">
                <span className="ref-voice-pulse"></span>
                <span>&ldquo;How can I help you?&rdquo;</span>
              </div>
              <Image
                src="/robot-assistant.png"
                alt="Friendly Futuristic AI Robot Assistant"
                width={210}
                height={210}
                priority
                className="ref-robot-img"
              />
            </div>

            {/* 2. Center: Modern Smartphone Chassis */}
            <div className="ref-phone-frame">
              <div className="ref-phone-top-bar">
                <span className="ref-phone-camera"></span>
                <span className="ref-phone-speaker"></span>
              </div>
              <div className="ref-phone-screen">
                <div className="ref-screen-ribbon">
                  <span className="ref-ribbon-dot"></span>
                  <span>BEST SELLER</span>
                </div>
                <div className="ref-screen-shelves">
                  <div className="ref-shelf-row">
                    <div className="ref-product-card">
                      <span className="ref-prod-emoji">👕</span>
                      <span className="ref-prod-title">Oxford Shirt</span>
                      <span className="ref-prod-price">$38.00</span>
                    </div>
                    <div className="ref-product-card">
                      <span className="ref-prod-emoji">⌚</span>
                      <span className="ref-prod-title">Chrono Watch</span>
                      <span className="ref-prod-price">$89.00</span>
                    </div>
                  </div>
                  <div className="ref-shelf-divider"></div>
                  <div className="ref-shelf-row">
                    <div className="ref-product-card">
                      <span className="ref-prod-emoji">👟</span>
                      <span className="ref-prod-title">Runner Shoes</span>
                      <span className="ref-prod-price">$65.00</span>
                    </div>
                    <div className="ref-product-card">
                      <span className="ref-prod-emoji">🎧</span>
                      <span className="ref-prod-title">ANC Earbuds</span>
                      <span className="ref-prod-price">$49.00</span>
                    </div>
                  </div>
                  <div className="ref-shelf-divider"></div>
                  <div className="ref-shelf-row">
                    <div className="ref-product-card">
                      <span className="ref-prod-emoji">📱</span>
                      <span className="ref-prod-title">Smart Tablet</span>
                      <span className="ref-prod-price">$199.00</span>
                    </div>
                    <div className="ref-product-card">
                      <span className="ref-prod-emoji">🧥</span>
                      <span className="ref-prod-title">Denim Jacket</span>
                      <span className="ref-prod-price">$54.00</span>
                    </div>
                  </div>
                </div>
                <div className="ref-screen-footer">
                  <button type="button" onClick={openSignUp} className="ref-screen-shop-btn">
                    SHOP
                  </button>
                </div>
              </div>
              <div className="ref-phone-home-indicator">
                <span className="ref-phone-home-btn"></span>
              </div>
            </div>

            {/* 3. Right: Shopping Cart Trolley */}
            <div className="ref-trolley-col" aria-label="Shopping Cart">
              <svg width="95" height="110" viewBox="0 0 105 120" fill="none">
                <path d="M30 18C28 10 34 4 42 6C48 8 50 14 46 22C42 30 32 26 30 18Z" fill="#9333ea" />
                <path d="M42 6C43 4 45 3 47 4C49 5 48 8 46 8" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="52" y="24" width="16" height="34" rx="3" fill="#facc15" />
                <rect x="70" y="28" width="14" height="30" rx="3" fill="#38bdf8" />
                <rect x="86" y="32" width="12" height="26" rx="2" fill="#f87171" />
                <path d="M44 42H100L92 84H52L44 42Z" fill="rgba(241, 245, 249, 0.75)" stroke="#94a3b8" strokeWidth="2.5" strokeLinejoin="round" />
                <line x1="56" y1="42" x2="62" y2="84" stroke="#94a3b8" strokeWidth="1.8" />
                <line x1="72" y1="42" x2="74" y2="84" stroke="#94a3b8" strokeWidth="1.8" />
                <line x1="88" y1="42" x2="86" y2="84" stroke="#94a3b8" strokeWidth="1.8" />
                <line x1="46" y1="56" x2="98" y2="56" stroke="#94a3b8" strokeWidth="1.8" />
                <line x1="49" y1="70" x2="95" y2="70" stroke="#94a3b8" strokeWidth="1.8" />
                <path d="M44 42L36 34H26" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M52 84L48 98H96" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="54" cy="104" r="6" fill="#0d9488" />
                <circle cx="54" cy="104" r="2" fill="#ffffff" />
                <circle cx="90" cy="104" r="6" fill="#0d9488" />
                <circle cx="90" cy="104" r="2" fill="#ffffff" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Dual-Layer Organic Green Bottom Waves with Infinite Marquee */}
      <div className="ref-waves-wrapper">
        <svg
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="ref-waves-svg"
          aria-hidden="true"
        >
          <defs>
            {/* Luminous Back Wave Ribbon Gradient */}
            <linearGradient id="backWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#16a34a" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#14532d" stopOpacity="0.4" />
            </linearGradient>

            {/* Front Wave: Smooth Melt from Vibrant Crest into Deep Midnight Green */}
            <linearGradient id="frontWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="12%" stopColor="#14532d" />
              <stop offset="42%" stopColor="#0f3e26" />
              <stop offset="100%" stopColor="#051f13" />
            </linearGradient>

            {/* Crest Glow Highlight Line */}
            <linearGradient id="crestGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#86efac" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Back Wave (Gentle Luminous Ribbon Contour) */}
          <path
            d="M0,50 C240,50 360,100 560,100 C760,100 780,35 980,35 C1160,35 1240,90 1360,85 C1400,83 1425,60 1440,50 L1440,320 L0,320 Z"
            fill="url(#backWaveGrad)"
          />

          {/* Front Wave (Deep Ground with Soft Gentle Curve and Crest Glow) */}
          <path
            d="M0,75 C240,75 360,125 560,125 C760,125 780,60 980,60 C1160,60 1240,115 1360,110 C1400,108 1425,85 1440,75 L1440,320 L0,320 Z"
            fill="url(#frontWaveGrad)"
            stroke="url(#crestGlowGrad)"
            strokeWidth="1.2"
          />
        </svg>

        {/* Continuous Smooth Infinite Marquee Running Right-to-Left */}
        <div className="hero-wave-marquee" role="marquee" aria-label="Core Commerce Highlights">
          <div className="hero-marquee-track">
            {/* Set 1 */}
            {MARQUEE_PHRASES.map((phrase, idx) => (
              <span key={`p1-${idx}`} className="hero-marquee-item">
                <span className="hero-marquee-text">{phrase}</span>
              </span>
            ))}
            {/* Set 2 (for seamless continuous infinite loop) */}
            {MARQUEE_PHRASES.map((phrase, idx) => (
              <span key={`p2-${idx}`} className="hero-marquee-item" aria-hidden="true">
                <span className="hero-marquee-text">{phrase}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
