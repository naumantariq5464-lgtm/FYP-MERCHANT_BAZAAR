"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface SidebarProps {
  store: {
    name: string;
    slug: string;
  } | null;
  userEmail?: string;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    exact: true,
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
    label: "Products & Stock",
    href: "/dashboard/products",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    label: "Categories",
    href: "/dashboard/categories",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Orders & Delivery",
    href: "/dashboard/orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    label: "Store Branding",
    href: "/dashboard/store/customize",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function Sidebar({
  store,
  userEmail,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const storeSlug = store?.slug || "";

  return (
    <>
      <aside
        style={{
          width: "260px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: mobileOpen ? "translateX(0)" : undefined,
          boxShadow: mobileOpen ? "4px 0 24px rgba(0,0,0,0.15)" : undefined,
        }}
        className="dashboard-sidebar"
      >
        {/* Brand & Store Profile Header with Mobile Close */}
        <div style={{ padding: "1.25rem", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
              <Image src="/logo.png" alt="Merchant Bazaar" width={32} height={32} />
              <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#111827" }}>
                Merchant<span style={{ color: "#1a5c38" }}>Bazaar</span>
              </span>
            </Link>
            <button
              onClick={onCloseMobile}
              className="dashboard-sidebar-close"
              style={{
                display: "none",
                background: "none",
                border: "none",
                fontSize: "1.4rem",
                color: "#64748b",
                cursor: "pointer",
                padding: "0.2rem",
                lineHeight: 1,
              }}
              aria-label="Close sidebar"
            >
              &times;
            </button>
          </div>

          {/* Store Box */}
          <div style={{
            backgroundColor: "#f9fafb",
            borderRadius: "10px",
            padding: "0.75rem 0.85rem",
            border: "1px solid #e5e7eb"
          }}>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {store?.name || "My Store"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#1a5c38", fontWeight: 600, marginTop: "0.15rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }} />
              <span>{storeSlug ? `${storeSlug}.merchantbazaar.com` : "Subdomain pending"}</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#1a5c38" : "#4b5563",
                  backgroundColor: isActive ? "#ecfdf5" : "transparent",
                  textDecoration: "none",
                  transition: "background-color 0.15s ease",
                }}
              >
                <span style={{ color: isActive ? "#1a5c38" : "#9ca3af", display: "flex", alignItems: "center" }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Account & Logout Footer */}
        <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #f3f4f6", backgroundColor: "#fafafa" }}>
          <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.2rem" }}>Logged in as:</div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "0.75rem" }}>
            {userEmail}
          </div>
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "0.45rem",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              color: "#dc2626",
              fontSize: "0.825rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 99 }}
        />
      )}
    </>
  );
}
