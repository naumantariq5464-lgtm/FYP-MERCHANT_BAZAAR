import React from "react";

interface FeatureItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
}

const features: FeatureItem[] = [
  {
    id: "branded-store",
    badge: "Storefront",
    title: "Your Own Branded Store",
    tag: "Subdomain & Branding",
    description:
      "Launch a custom branded store on your dedicated subdomain with logos, promotional banners, and direct customer discovery.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    id: "inventory",
    badge: "Catalog",
    title: "Product & Inventory Management",
    tag: "Multi-Variant Control",
    description:
      "Organize categories, upload product images, set prices, and track multi-variant stock levels from a unified merchant dashboard.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
  },
  {
    id: "checkout",
    badge: "Checkout",
    title: "Simple Customer Checkout",
    tag: "Frictionless Guest Buying",
    description:
      "Frictionless guest checkout with instant cart management and direct orders without forced account creation.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    ),
  },
  {
    id: "orders",
    badge: "Orders",
    title: "Centralized Order Management",
    tag: "Real-Time Tracking",
    description:
      "Receive live store orders, inspect customer shipping details, and track statuses from payment confirmation to dispatch.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
  },
  {
    id: "voice-agents",
    badge: "AI Voice",
    title: "Background AI Voice Agents",
    tag: "Spoken Conversational UI",
    description:
      "Ambient AI voice agents welcome shoppers, answer policy and product questions, and guide customer journeys naturally.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
      </svg>
    ),
  },
  {
    id: "discovery",
    badge: "Search",
    title: "Intelligent Product Discovery",
    tag: "Natural Language Retrieval",
    description:
      "Semantic search instantly retrieves relevant items from your store catalog based on natural customer requests.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    ),
  },
  {
    id: "sales-agents",
    badge: "AI Selling",
    title: "AI Sales Agents",
    tag: "Automated Conversion",
    description:
      "Autonomous sales agents articulate product value, overcome purchase objections, and guide interested shoppers to checkout.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
  },
  {
    id: "multi-tenant",
    badge: "Architecture",
    title: "One Platform, Independent Stores",
    tag: "Isolated Cloud Tenancy",
    description:
      "Dedicated merchant stores, private catalogs, and individual branding powered by shared, high-availability platform infrastructure.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="landing-section">
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-section-header">
          <div className="landing-section-eyebrow">EVERYTHING YOU NEED TO SELL ONLINE</div>
          <h2 className="landing-section-title">
            One Platform to Build, Manage, and Grow Your Online Business.
          </h2>
          <p className="landing-section-subtitle">
            From launching your branded storefront to managing inventory, processing orders, and introducing intelligent sales assistance, Merchant Bazaar brings your online business operations together in one platform.
          </p>
        </div>

        {/* Clean, Symmetrical SaaS Cards Grid */}
        <div className="landing-clean-cards-grid">
          {features.map((feature) => (
            <div key={feature.id} className="clean-feature-card">
              <div className="clean-card-header">
                <div className="clean-card-icon-wrap">{feature.icon}</div>
                <span className="clean-card-badge">{feature.badge}</span>
              </div>
              <h3 className="clean-card-title">{feature.title}</h3>
              <p className="clean-card-description">{feature.description}</p>
              <div className="clean-card-footer">
                <span className="clean-card-tag">{feature.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
