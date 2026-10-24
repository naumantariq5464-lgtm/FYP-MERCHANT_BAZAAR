"use client";

import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is Merchant Bazaar?",
    answer:
      "Merchant Bazaar is a multi-tenant e-commerce platform designed to help businesses create branded online stores, manage products and orders, and progressively introduce AI-powered shopping and sales assistance.",
  },
  {
    question: "Can I create my own online store?",
    answer:
      "Yes. Merchants can create a store, configure its branding, add product categories and products, and publish a dedicated storefront.",
  },
  {
    question: "Will my store have its own web address?",
    answer:
      "Each store is designed to have its own subdomain under the configured Merchant Bazaar domain, subject to domain and hosting configuration.",
  },
  {
    question: "Can I manage product sizes, colors, prices, and quantities?",
    answer:
      "The platform is designed to support product details, categories, pricing, stock quantities, and variants such as size and color.",
  },
  {
    question: "Do customers need an account to place an order?",
    answer:
      "The platform is designed to support guest checkout, allowing customers to place orders without creating an account.",
  },
  {
    question: "How will AI voice agents help my customers?",
    answer:
      "Voice agents are designed to answer store-related questions, help customers discover relevant products, and guide them through the shopping experience using natural spoken conversations.",
  },
  {
    question: "What do AI sales agents do?",
    answer:
      "AI sales agents are designed to explain product benefits, address customer questions, recommend relevant products, and guide shoppers toward checkout.",
  },
  {
    question: "Will AI agents be available immediately?",
    answer:
      "Core store creation and e-commerce capabilities are the foundation of the platform. AI voice and sales-agent capabilities will be introduced progressively as the platform develops.",
  },
  {
    question: "Can I manage everything from one dashboard?",
    answer:
      "Merchants can manage their store operations through a centralized seller dashboard, while platform-level administration is handled separately.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="landing-section landing-section-muted">
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-section-header">
          <div className="landing-section-eyebrow">COMMON QUESTIONS & ANSWERS</div>
          <h2 className="landing-section-title">Frequently Asked Questions</h2>
          <p className="landing-section-subtitle">
            Find clear answers about how Merchant Bazaar works, store ownership, and our upcoming AI capabilities.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="landing-faq-wrapper">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`landing-faq-item ${isOpen ? "faq-open" : ""}`}
              >
                <button
                  type="button"
                  className="landing-faq-question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-toggle-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="landing-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
