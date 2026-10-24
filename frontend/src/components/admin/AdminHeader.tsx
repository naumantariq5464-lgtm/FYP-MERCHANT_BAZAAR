"use client";

import React from "react";
import { AdminTabKey } from "./AdminSidebar";

interface AdminHeaderProps {
  activeTab: AdminTabKey;
  loading: boolean;
  onRefresh: () => void;
  onOpenMobile: () => void;
}

const TAB_TITLES: Record<AdminTabKey, { title: string; subtitle: string }> = {
  overview: {
    title: "Platform Overview",
    subtitle: "High-level platform activity, store counts, and tenant catalog metrics",
  },
  stores: {
    title: "Storefronts & Multi-Tenant Registry",
    subtitle: "Audit tenant stores, manage live visibility, and test custom subdomains",
  },
  users: {
    title: "Merchants & User Accounts",
    subtitle: "Platform sellers, administrative roles, and active merchant profiles",
  },
};

export default function AdminHeader({
  activeTab,
  loading,
  onRefresh,
  onOpenMobile,
}: AdminHeaderProps) {
  const current = TAB_TITLES[activeTab];

  return (
    <header style={{
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #e2e8f0",
      padding: "0.85rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 90
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={onOpenMobile}
          className="admin-hamburger"
          style={{ display: "none", background: "none", border: "none", color: "#1e293b", cursor: "pointer", padding: "0.25rem" }}
          aria-label="Open sidebar"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
            {current.title}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
            {current.subtitle}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            color: "#334155",
            padding: "0.4rem 0.85rem",
            borderRadius: "8px",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem"
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ animation: loading ? "spin 1s linear infinite" : "none" }}
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span>{loading ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
