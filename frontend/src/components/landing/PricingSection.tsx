"use client";

import React, { useState } from "react";
import { useAuthModal } from "@/context/AuthModalContext";

export default function PricingSection() {
  const { openSignUp } = useAuthModal();
  const [currency, setCurrency] = useState<"USD" | "PKR">("USD");

  const plans = [
    {
      id: "starter",
      name: "Starter Merchant",
      badge: "Free Forever",
      priceUSD: "$0",
      pricePKR: "Rs 0",
      period: "/ forever",
      description:
        "Perfect for small vendors and startups ready to launch their first branded digital storefront.",
      features: [
        "1 Branded Digital Storefront",
        "Dedicated Store URL (.merchantbazaar.com)",
        "Up to 25 Products & Stock Variants",
        "Standard Seller Dashboard & Orders",
        "Basic Conversational AI Sales Support",
        "Community & Forum Assistance",
      ],
      popular: false,
      buttonText: "Start Free Store",
    },
    {
      id: "pro",
      name: "Pro Merchant",
      badge: "Most Popular",
      priceUSD: "$29",
      pricePKR: "Rs 7,999",
      period: "/ month",
      description:
        "Designed for growing brands that want autonomous real-time voice sales agents and scale.",
      features: [
        "Everything in Starter, plus:",
        "Unlimited Products & Categories",
        "Autonomous Voice AI Sales Agent",
        "Zero-Touch Real-Time Voice Ordering",
        "Brand Policy PDF Knowledge Grounding",
        "Advanced Analytics & Sales Tracking",
        "Custom Brand Themes & Color Palettes",
      ],
      popular: true,
      buttonText: "Launch Pro Store",
    },
    {
      id: "enterprise",
      name: "Enterprise & Scale",
      badge: "Full Power",
      priceUSD: "$99",
      pricePKR: "Rs 24,999",
      period: "/ month",
      description:
        "Tailored for high-volume retail networks, multi-brand merchants, and enterprise requirements.",
      features: [
        "Everything in Pro, plus:",
        "Multiple Storefronts Management",
        "Custom AI Voice Persona & Knowledge Base",
        "Dedicated Low-Latency Voice Channels",
        "Custom Checkout & Inventory Integrations",
        "24/7 Dedicated Account Manager & SLA",
        "Priority Onboarding & Dedicated Setup",
      ],
      popular: false,
      buttonText: "Get Enterprise Access",
    },
  ];

  return (
    <section id="pricing" className="pricing-section">
      <div className="pricing-container">
        {/* Section Header */}
        <div className="pricing-header">
          <div className="pricing-badge">
            <span>TRANSPARENT VALUE PLANS</span>
          </div>
          <h2 className="pricing-title">Simple, Scale-Ready Pricing</h2>
          <p className="pricing-subtitle">
            Everything you need to launch, customize, and operate your AI-powered
            storefront with zero hidden fees.
          </p>

          {/* Interactive Currency Switcher Toggle */}
          <div className="pricing-toggle-wrap" role="group" aria-label="Currency Switcher">
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`pricing-toggle-btn ${currency === "USD" ? "active" : ""}`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("PKR")}
              className={`pricing-toggle-btn ${currency === "PKR" ? "active" : ""}`}
            >
              PKR (Rs)
              <span className="pricing-toggle-discount">Local</span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="pricing-grid">
          {plans.map((p) => {
            const price = currency === "USD" ? p.priceUSD : p.pricePKR;
            return (
              <div
                key={p.id}
                className={`pricing-card ${p.popular ? "popular" : ""}`}
              >
                {p.popular && (
                  <div className="pricing-popular-tag">
                    MOST POPULAR
                  </div>
                )}

                <div className="pricing-card-header">
                  <h3 className="pricing-plan-name">{p.name}</h3>
                  <span className="pricing-plan-badge">{p.badge}</span>
                </div>

                <div className="pricing-price-wrap">
                  <span className="pricing-price-amt">{price}</span>
                  <span className="pricing-price-period">{p.period}</span>
                </div>

                <p className="pricing-plan-desc">{p.description}</p>

                <ul className="pricing-features-list">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="pricing-feature-item">
                      <div className="pricing-feature-icon">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={openSignUp}
                  className={`pricing-cta-btn ${
                    p.popular ? "popular-btn" : ""
                  }`}
                >
                  {p.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
