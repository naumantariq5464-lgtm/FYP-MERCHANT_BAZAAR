"use client";

import React from "react";
import Link from "next/link";
import { useAuthModal } from "@/context/AuthModalContext";

interface StepItem {
  number: string;
  title: string;
  description: string;
}

const steps: StepItem[] = [
  {
    number: "01",
    title: "Create Your Store",
    description:
      "Register as a merchant, choose your store name, set up your branding, and establish your dedicated storefront.",
  },
  {
    number: "02",
    title: "Add Products and Publish",
    description:
      "Upload product images, create categories, set prices and inventory, customize your storefront, and publish your store on its own subdomain.",
  },
  {
    number: "03",
    title: "Manage Orders and Customers",
    description:
      "Receive customer orders, review delivery information, and manage order statuses from your seller dashboard.",
  },
  {
    number: "04",
    title: "Introduce Intelligent AI Assistance",
    description:
      "As AI capabilities become available, activate voice assistance and intelligent sales workflows designed to answer questions, guide product discovery, and support customer purchasing decisions.",
  },
];

export default function HowItWorksSection() {
  const { openSignUp } = useAuthModal();

  return (
    <section id="how-it-works" className="landing-section" style={{ background: "#ffffff", borderTop: "1px solid #e5e7eb" }}>
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-section-header">
          <div className="landing-section-eyebrow">FROM STORE SETUP TO INTELLIGENT SELLING</div>
          <h2 className="landing-section-title">Launch Your Store. Manage Your Business. Expand with AI.</h2>
          <p className="landing-section-subtitle">
            Start with the essential tools for running your online store and build toward a more intelligent shopping and sales experience as Merchant Bazaar evolves.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="how-it-works-grid">
          {steps.map((step) => (
            <div key={step.number} className="how-it-works-card">
              <div style={{
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#1a5c38",
                marginBottom: "0.75rem",
                lineHeight: 1
              }}>
                {step.number}
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.55, margin: 0 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <button
            type="button"
            onClick={openSignUp}
            className="btn btn-primary btn-lg"
          >
            Create Your Store
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: "8px" }}
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
