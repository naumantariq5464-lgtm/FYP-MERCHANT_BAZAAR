"use client";

import React from "react";

interface HeaderProps {
  storeName?: string;
  isPublished: boolean;
  toggling: boolean;
  onTogglePublish: () => void;
  onOpenMobile: () => void;
}

export default function Header({
  storeName,
  isPublished,
  toggling,
  onTogglePublish,
  onOpenMobile,
}: HeaderProps) {
  return (
    <header
      className="dashboard-header"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0.85rem 1.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 90,
      }}
    >
      {/* Mobile hamburger & Store Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={onOpenMobile}
          className="dashboard-hamburger"
          style={{
            display: "none",
            background: "none",
            border: "none",
            padding: "0.4rem",
            cursor: "pointer",
            color: "#374151"
          }}
          aria-label="Open sidebar"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="dashboard-header-title" style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827" }}>
          {storeName || "My Store"} &bull; <span style={{ color: "#6b7280", fontWeight: 500 }}>Seller Console</span>
        </div>
      </div>

      {/* Right: Status Badge & Desktop-only Toggle Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
        <span style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          padding: "0.25rem 0.65rem",
          borderRadius: "9999px",
          backgroundColor: isPublished ? "#ecfdf5" : "#fef3c7",
          color: isPublished ? "#065f46" : "#92400e",
          border: isPublished ? "1px solid #a7f3d0" : "1px solid #fde68a",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          whiteSpace: "nowrap",
        }}>
          <span style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: isPublished ? "#10b981" : "#f59e0b"
          }} />
          <span>{isPublished ? "Live" : "Draft Mode"}</span>
        </span>

        <button
          onClick={onTogglePublish}
          disabled={toggling}
          className="header-publish-btn"
          style={{
            padding: "0.45rem 0.9rem",
            borderRadius: "8px",
            fontSize: "0.825rem",
            fontWeight: 700,
            border: isPublished ? "1px solid #d1d5db" : "none",
            backgroundColor: isPublished ? "#ffffff" : "#1a5c38",
            color: isPublished ? "#374151" : "#ffffff",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            whiteSpace: "nowrap",
          }}
        >
          {toggling ? "Updating..." : isPublished ? "Switch to Draft" : "Publish Store"}
        </button>
      </div>

    </header>
  );
}
