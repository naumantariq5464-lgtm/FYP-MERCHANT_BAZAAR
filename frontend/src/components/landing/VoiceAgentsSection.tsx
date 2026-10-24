import React from "react";

export default function VoiceAgentsSection() {
  return (
    <section id="voice-agents" className="landing-section" style={{ background: "#ffffff", borderTop: "1px solid #e5e7eb" }}>
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-section-header">
          <div className="landing-section-eyebrow">A NEW WAY TO SHOP ONLINE</div>
          <h2 className="landing-section-title">Meet Your Store&apos;s Intelligent Voice Assistant.</h2>
          <p className="landing-section-subtitle">
            Imagine a customer visiting your store and asking a question aloud instead of searching through pages of information. Merchant Bazaar is designed to make that experience possible with background voice agents that listen, understand the customer&apos;s request, and respond naturally.
          </p>
          <p className="landing-section-subtitle" style={{ marginTop: "0.5rem" }}>
            The agent can help customers understand store policies, explore product options, find relevant items, and move through the shopping journey with less friction.
          </p>
        </div>

        {/* Visual & Capabilities Grid */}
        <div className="voice-agents-layout">
          
          {/* Visual Showcase: Integrated Background Voice Interface */}
          <div className="voice-visual-container">
            {/* Storefront Simulated Header */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", paddingBottom: "1rem", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#1a5c38", flexShrink: 0 }}></div>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827" }}>UrbanCraft Atelier</span>
                <span style={{ fontSize: "0.75rem", color: "#6b7280", wordBreak: "break-all" }}>· urbancraft.merchantbazaar.com</span>
              </div>
              <span style={{ fontSize: "0.75rem", background: "#ecfdf5", color: "#1a5c38", border: "1px solid #a7f3d0", padding: "0.2rem 0.5rem", borderRadius: "9999px", fontWeight: 600, flexShrink: 0 }}>
                Storefront Live
              </span>
            </div>

            {/* Subtle Voice Waveform Indicator */}
            <div style={{
              marginTop: "1.25rem",
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #d1fae5",
              padding: "1rem",
              boxShadow: "0 2px 8px rgba(26,92,56,0.06)",
              boxSizing: "border-box"
            }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ position: "relative", display: "flex", height: "10px", width: "10px", flexShrink: 0 }}>
                    <span style={{
                      position: "absolute",
                      display: "inline-flex",
                      height: "100%",
                      width: "100%",
                      borderRadius: "50%",
                      backgroundColor: "#1a5c38",
                      opacity: 0.75
                    }}></span>
                    <span style={{
                      position: "relative",
                      display: "inline-flex",
                      borderRadius: "50%",
                      height: "10px",
                      width: "10px",
                      backgroundColor: "#1a5c38"
                    }}></span>
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1a5c38", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Background AI Voice Active
                  </span>
                </div>
                <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>Ambient Listening</span>
              </div>

              {/* Sound Waveform Visualization */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "3px", height: "32px", padding: "0.2rem 0", overflow: "hidden" }}>
                {[6, 14, 22, 28, 18, 26, 32, 20, 14, 24, 30, 16, 10, 24, 28, 12, 8].map((height, i) => (
                  <div
                    key={i}
                    style={{
                      width: "3px",
                      height: `${height}px`,
                      background: i % 2 === 0 ? "#1a5c38" : "#2e7d4d",
                      borderRadius: "2px",
                      opacity: 0.85,
                      flexShrink: 0
                    }}
                  />
                ))}
              </div>

              {/* Spoken Interaction Preview */}
              <div style={{ marginTop: "0.85rem", borderTop: "1px solid #f3f4f6", paddingTop: "0.75rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Shopper Spoke:</div>
                <div style={{ fontSize: "0.8125rem", color: "#1f2937", fontStyle: "italic", fontWeight: 500, lineHeight: 1.4 }}>
                  &ldquo;Do you have this organic cotton jacket in olive green, and what is your delivery timeframe?&rdquo;
                </div>
                <div style={{ marginTop: "0.6rem", background: "#f0fdf4", padding: "0.6rem 0.75rem", borderRadius: "8px", borderLeft: "3px solid #1a5c38" }}>
                  <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 600 }}>Agent Response (Audio & Catalog Retrieval):</div>
                  <div style={{ fontSize: "0.8rem", color: "#14532d", marginTop: "0.15rem", lineHeight: 1.4 }}>
                    &ldquo;Yes, olive green is in stock in sizes M and L with standard 2-3 day shipping. I have brought up the product card on your screen.&rdquo;
                  </div>
                </div>
              </div>
            </div>

            {/* Seamless Storefront Catalog Card Response */}
            <div style={{ marginTop: "1rem", background: "#ffffff", borderRadius: "10px", border: "1px solid #e5e7eb", padding: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "6px", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: "0.75rem", fontWeight: 600, flexShrink: 0 }}>
                Catalog
              </div>
              <div style={{ flex: 1, minWidth: "160px" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>Organic Cotton Workwear Jacket</div>
                <div style={{ fontSize: "0.75rem", color: "#4b5563" }}>Color: Olive Green · Size: M, L · $89.00</div>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#1a5c38", fontWeight: 600, background: "#ecfdf5", padding: "0.2rem 0.5rem", borderRadius: "6px", flexShrink: 0 }}>
                In Stock
              </span>
            </div>
          </div>

          {/* 4 Key Capabilities */}
          <div className="voice-capabilities-list">
            
            <div className="voice-capability-item">
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>
                Natural Voice Conversations
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.5, margin: 0 }}>
                Customers can ask questions and receive spoken responses without relying on a traditional text-based chatbot interface.
              </p>
            </div>

            <div className="voice-capability-item">
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>
                Store-Aware Answers
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.5, margin: 0 }}>
                The agent is designed to use the merchant&apos;s store information and product data to answer relevant questions about products, delivery, returns, exchanges, and other store policies.
              </p>
            </div>

            <div className="voice-capability-item">
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>
                Guided Product Discovery
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.5, margin: 0 }}>
                Customers can describe what they need, and the agent can help identify relevant products and display them in the storefront.
              </p>
            </div>

            <div className="voice-capability-item">
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>
                Shopping Journey Assistance
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.5, margin: 0 }}>
                The agent is designed to guide customers through relevant steps of the shopping journey, while keeping the customer in control of important actions such as selecting products and confirming an order.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
