import React from "react";

export default function StorefrontShowcase() {
  const stores = [
    {
      name: "UrbanCraft Atelier",
      category: "Apparel & Fashion",
      subdomain: "urbancraft.merchantbazaar.com",
      accent: "#1a5c38",
      items: "48 Products · Active Orders",
    },
    {
      name: "Nordic Living",
      category: "Home & Furniture",
      subdomain: "nordic.merchantbazaar.com",
      accent: "#334155",
      items: "32 Products · Active Orders",
    },
    {
      name: "Aroma Botanicals",
      category: "Organic Skincare",
      subdomain: "aroma.merchantbazaar.com",
      accent: "#065f46",
      items: "24 Products · Active Orders",
    },
  ];

  return (
    <section id="multi-tenant" className="landing-section" style={{ background: "#fcfdfc", borderTop: "1px solid #e5e7eb" }}>
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-section-header">
          <div className="landing-section-eyebrow">ONE PLATFORM. INDEPENDENT STOREFRONTS.</div>
          <h2 className="landing-section-title">Every Merchant Gets Their Own Digital Storefront.</h2>
          <p className="landing-section-subtitle">
            Merchant Bazaar brings multiple businesses together on one shared platform while giving each merchant an independent online store. Each storefront has its own identity, product catalog, and order-management environment.
          </p>
        </div>

        {/* Clean Architecture Diagram (One Platform -> 3 Independent Stores) */}
        <div className="multi-tenant-arch-card">
          {/* Central Platform Core Node */}
          <div className="platform-core-node">
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.85, fontWeight: 600 }}>
              Shared Foundation
            </div>
            <div style={{ fontSize: "1.125rem", fontWeight: 700, marginTop: "0.2rem" }}>
              Merchant Bazaar Platform Infrastructure
            </div>
            <div style={{ fontSize: "0.8125rem", opacity: 0.9, marginTop: "0.35rem", lineHeight: 1.4 }}>
              Multi-Tenant Routing · Cloud Database · Voice & Sales Engine · Unified Checkout
            </div>
          </div>

          {/* Connector Graphic */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "1.25rem 0" }}>
            <div style={{ width: "2px", height: "24px", background: "#cbd5e1" }}></div>
          </div>

          {/* Connected Independent Stores */}
          <div className="multi-tenant-stores-grid">
            {stores.map((store, index) => (
              <div key={index} className="tenant-store-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem", gap: "0.5rem" }}>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: store.accent,
                    background: "#ffffff",
                    border: `1px solid ${store.accent}40`,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "6px"
                  }}>
                    {store.category}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Isolated Tenant</span>
                </div>

                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827" }}>
                  {store.name}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#1a5c38", fontWeight: 600, marginTop: "0.25rem", wordBreak: "break-all" }}>
                  {store.subdomain}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#6b7280", marginTop: "0.4rem" }}>
                  {store.items}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Pillars: Merchant Dashboard, Customer Storefront, Shared Infrastructure */}
        <div className="multi-tenant-pillars-grid">
          <div className="multi-tenant-pillar-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
              Merchant Dashboard
            </h3>
            <p style={{ fontSize: "0.9375rem", color: "#4b5563", lineHeight: 1.5, margin: 0 }}>
              Manage store branding, categories, products, stock quantities, and customer orders from a centralized control panel.
            </p>
          </div>

          <div className="multi-tenant-pillar-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
              Customer Storefront
            </h3>
            <p style={{ fontSize: "0.9375rem", color: "#4b5563", lineHeight: 1.5, margin: 0 }}>
              Customers visit the merchant&apos;s dedicated store, browse available products, and place orders through a straightforward shopping experience.
            </p>
          </div>

          <div className="multi-tenant-pillar-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
              Shared Platform Infrastructure
            </h3>
            <p style={{ fontSize: "0.9375rem", color: "#4b5563", lineHeight: 1.5, margin: 0 }}>
              The platform provides the underlying services required to support independent storefronts without requiring each merchant to build and maintain a separate e-commerce application.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
