import React from "react";

export default function AdminGovernanceSection() {
  const capabilities = [
    "Merchant and account management.",
    "Total stores and published-store overview.",
    "Draft and suspended store monitoring.",
    "Platform-wide order statistics.",
    "Store and account activation or suspension controls.",
  ];

  return (
    <section id="governance" className="landing-section" style={{ background: "#ffffff", borderTop: "1px solid #e5e7eb" }}>
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-section-header">
          <div className="landing-section-eyebrow">CENTRALIZED PLATFORM GOVERNANCE</div>
          <h2 className="landing-section-title">Manage the Entire Marketplace from One Place.</h2>
          <p className="landing-section-subtitle">
            Merchant Bazaar includes a dedicated Super Admin dashboard for platform-level oversight. The platform administrator can review registered merchants, monitor store creation and publishing activity, view platform-wide order statistics, and manage account or store status.
          </p>
        </div>

        {/* Governance Overview Card */}
        <div className="admin-governance-card">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "1.25rem" }}>
            Platform Governance Capabilities
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {capabilities.map((item, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#ecfdf5",
                  color: "#1a5c38",
                  flexShrink: 0,
                  marginTop: "2px"
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span style={{ fontSize: "0.9375rem", color: "#374151", lineHeight: 1.5 }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
