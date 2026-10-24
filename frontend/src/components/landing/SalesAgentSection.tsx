"use client";

import React from "react";
import { useAuthModal } from "@/context/AuthModalContext";

interface SalesStep {
  step: string;
  title: string;
  description: string;
}

const salesSteps: SalesStep[] = [
  {
    step: "Step 1",
    title: "Discover Customer Needs",
    description:
      "The agent understands what the shopper is looking for through the conversation and identifies relevant products from the merchant's catalog.",
  },
  {
    step: "Step 2",
    title: "Explain and Recommend",
    description:
      "The agent presents relevant product information, explains useful features, answers questions, and helps the customer compare suitable options.",
  },
  {
    step: "Step 3",
    title: "Guide the Purchase",
    description:
      "When a customer is interested, the agent guides them toward the relevant product page, variant selection, and checkout process.",
  },
  {
    step: "Step 4",
    title: "Record and Manage the Order",
    description:
      "Orders placed through the storefront are recorded in the platform and made available to the merchant through the seller dashboard.",
  },
];

export default function SalesAgentSection() {
  const { openSignUp } = useAuthModal();

  return (
    <section id="ai-sales-agents" className="landing-section" style={{ background: "#fcfdfc" }}>
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-section-header">
          <div className="landing-section-eyebrow">INTELLIGENT DIGITAL SALES</div>
          <h2 className="landing-section-title">Turn Customer Conversations into Product Sales.</h2>
          <p className="landing-section-subtitle">
            Merchant Bazaar is designed to help merchants extend their sales reach through intelligent AI sales agents. These agents can explain product benefits, answer questions, address customer concerns, and help shoppers choose products that match their needs.
          </p>
          <p className="landing-section-subtitle" style={{ marginTop: "0.5rem" }}>
            Instead of relying entirely on manual conversations, merchants can work toward a more scalable sales experience supported by automated digital assistance.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="sales-steps-grid">
          {salesSteps.map((item, idx) => (
            <div key={idx} className="sales-step-card">
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ecfdf5",
                color: "#1a5c38",
                fontWeight: 700,
                fontSize: "0.75rem",
                padding: "0.25rem 0.65rem",
                borderRadius: "9999px",
                alignSelf: "flex-start",
                marginBottom: "0.85rem",
                border: "1px solid #a7f3d0"
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.55, margin: 0 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Closing Statement & CTA */}
        <div className="sales-closing-card">
          <div style={{ flex: 1, minWidth: "240px" }}>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", lineHeight: 1.4 }}>
              Give your products a smarter way to reach customers, answer questions, and support purchasing decisions.
            </div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "0.25rem", lineHeight: 1.4 }}>
              Automated digital sales assistance designed to scale seamlessly with your merchant catalog.
            </div>
          </div>
          <button
            type="button"
            onClick={openSignUp}
            className="btn btn-primary btn-md"
            style={{ flexShrink: 0 }}
          >
            Explore Intelligent Selling
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
        </div>
      </div>
    </section>
  );
}
