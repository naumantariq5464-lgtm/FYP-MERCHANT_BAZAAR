"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthModal } from "@/context/AuthModalContext";

export default function Footer() {
  const { openSignIn, openSignUp } = useAuthModal();

  return (
    <footer className="ref-footer">
      <div className="ref-footer-container">
        {/* Top Tier: Brand Card & Highlights */}
        <div className="ref-footer-top-banner">
          <div className="ref-footer-banner-left">
            <span className="ref-footer-pill-tag">NEXT-GEN SAAS COMMERCE</span>
            <h3 className="ref-footer-banner-heading">
              Ready to build your AI-powered digital storefront?
            </h3>
            <p className="ref-footer-banner-sub">
              Empower your customers with hands-free voice sales agents and isolated subdomains today.
            </p>
          </div>
          <div className="ref-footer-banner-actions">
            <button
              type="button"
              onClick={openSignUp}
              className="ref-btn-primary"
            >
              Create Your Store
            </button>
            <Link href="/docs" className="ref-btn-secondary-white">
              View Documentation
            </Link>
          </div>
        </div>

        {/* Middle Tier: 4-Column Structured Directory */}
        <div className="ref-footer-grid">
          {/* Column 1: Brand Identity */}
          <div className="ref-footer-col-brand">
            <Link href="/" className="ref-footer-logo-link">
              <Image
                src="/logo.png"
                alt="Merchant Bazaar"
                width={38}
                height={38}
                className="ref-footer-logo"
              />
              <span className="ref-footer-brand-title">Merchant Bazaar</span>
            </Link>
            <p className="ref-footer-brand-bio">
              Merchant Bazaar is an enterprise-grade digital store platform.
              It enables independent sellers to deploy custom online storefronts equipped with
              real-time conversational voice AI sales agents that assist customers and drive orders.
            </p>
            <div className="ref-footer-social-tags">
              <span className="ref-tag-badge">AI Sales Agents</span>
              <span className="ref-tag-badge">Voice Commerce</span>
              <span className="ref-tag-badge">Smart Storefronts</span>
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div className="ref-footer-col">
            <h4 className="ref-footer-heading">Platform</h4>
            <ul className="ref-footer-links">
              <li><Link href="/docs" className="ref-footer-link">How It Works (Docs)</Link></li>
              <li><a href="/#pricing" className="ref-footer-link">Pricing Plans</a></li>
              <li><Link href="/docs#ai-agents" className="ref-footer-link">Voice Shopping Guide</Link></li>
              <li><Link href="/docs#quickstart" className="ref-footer-link">Quickstart Tutorial</Link></li>
            </ul>
          </div>

          {/* Column 3: Merchant Portal */}
          <div className="ref-footer-col">
            <h4 className="ref-footer-heading">For Merchants</h4>
            <ul className="ref-footer-links">
              <li>
                <button
                  type="button"
                  onClick={openSignUp}
                  className="ref-footer-link-btn"
                >
                  Create Your Store
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openSignIn}
                  className="ref-footer-link-btn"
                >
                  Merchant Sign In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openSignIn}
                  className="ref-footer-link-btn"
                >
                  Seller Dashboard
                </button>
              </li>
              <li>
                <Link href="/docs#store-management" className="ref-footer-link">
                  Store Customization
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust, Security & Support */}
          <div className="ref-footer-col">
            <h4 className="ref-footer-heading">Trust &amp; Security</h4>
            <ul className="ref-footer-links">
              <li><Link href="/docs#data-protection" className="ref-footer-link">Store &amp; Data Protection</Link></li>
              <li><Link href="/docs#rag-policies" className="ref-footer-link">Brand Policy PDF Grounding</Link></li>
              <li>
                <span className="ref-status-indicator">
                  <span className="ref-status-dot"></span>
                  All Stores Online &amp; Secure
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Commercial Platform Branding */}
        <div className="ref-footer-bottom">
          <p className="ref-footer-copy">
            &copy; 2026 Merchant Bazaar. All rights reserved.
          </p>
          <div className="ref-footer-bottom-tech">
            <span>Powered by Merchant Bazaar &bull; Intelligent Digital Commerce Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
