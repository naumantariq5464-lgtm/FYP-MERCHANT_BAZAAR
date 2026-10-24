"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export type AdminTabKey = "overview" | "stores" | "users";

interface AdminSidebarProps {
  activeTab: AdminTabKey;
  onSelectTab: (tab: AdminTabKey) => void;
  storesCount: number;
  usersCount: number;
  adminEmail?: string;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  storesCount,
  usersCount,
  adminEmail,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const tabs = [
    {
      key: "overview" as AdminTabKey,
      label: "Platform Overview",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ),
    },
    {
      key: "stores" as AdminTabKey,
      label: "Stores Governance",
      count: storesCount,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      key: "users" as AdminTabKey,
      label: "Merchants",
      count: usersCount,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <aside
        style={{
          width: "260px",
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: mobileOpen ? "translateX(0)" : undefined,
          boxShadow: mobileOpen ? "4px 0 24px rgba(0,0,0,0.5)" : undefined,
          borderRight: "1px solid #1e293b",
        }}
        className="admin-sidebar"
      >
        {/* Brand Header with Mobile Close (✕) Button */}
        <div style={{ padding: "1.25rem 1.25rem", borderBottom: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <Image src="/logo.png" alt="Merchant Bazaar" width={30} height={30} />
              <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff" }}>
                Merchant<span style={{ color: "#34d399" }}>Bazaar</span>
              </span>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="admin-sidebar-close"
              style={{
                display: "none",
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: "1.25rem",
                cursor: "pointer",
                padding: "0.25rem",
                lineHeight: 1,
              }}
              aria-label="Close sidebar"
            >
              &times;
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{
              background: "rgba(52, 211, 153, 0.15)",
              color: "#34d399",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              fontSize: "0.7rem",
              fontWeight: 800,
              padding: "0.2rem 0.6rem",
              borderRadius: "9999px",
              letterSpacing: "0.06em",
              textTransform: "uppercase"
            }}>
              Super Admin
            </span>
            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Control Plane</span>
          </div>
        </div>

        {/* Navigation Tabs (System & Services removed) */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  onSelectTab(tab.key);
                  onCloseMobile();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#ffffff" : "#94a3b8",
                  backgroundColor: isActive ? "#1e293b" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: isActive ? "#34d399" : "#64748b", display: "flex", alignItems: "center" }}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: isActive ? "#334155" : "#1e293b",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "10px",
                    color: isActive ? "#ffffff" : "#94a3b8"
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer: Root Account & Sign Out */}
        <div style={{ padding: "1.25rem", borderTop: "1px solid #1e293b", backgroundColor: "#090d16" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.2rem" }}>Signed in as:</div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "0.75rem" }}>
            {adminEmail}
          </div>
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "0.45rem",
              borderRadius: "6px",
              border: "1px solid #334155",
              backgroundColor: "#1e293b",
              color: "#f87171",
              fontSize: "0.825rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 99 }}
        />
      )}

      <style jsx global>{`
        @media (max-width: 900px) {
          .admin-sidebar-close {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
