"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";

interface Order {
  id: string;
  customer_name: string;
  total_amount: string | number;
  status: string;
  created_at: string;
  items: any[];
}

interface Product {
  id: string;
  name: string;
  price: string | number;
  stock_quantity: number;
  status: string;
  category_name?: string;
}

export default function SellerOverviewPage() {
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPublishPopup, setShowPublishPopup] = useState(false);
  const [showCustomizeWelcome, setShowCustomizeWelcome] = useState(false);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const [storeRes, catRes, prodRes, ordRes] = await Promise.allSettled([
        api.get("/stores/me"),
        api.get("/categories"),
        api.get("/products"),
        api.get("/orders"),
      ]);

      if (storeRes.status === "fulfilled") {
        const s = storeRes.value.data;
        setStore(s);
        const isCustomized = Boolean(s?.settings?.logo_url || (s?.settings?.hero_images && s.settings.hero_images.length > 0));
        const seen = typeof window !== "undefined" && sessionStorage.getItem(`mb_cust_seen_${s?.id}`);
        if (!isCustomized && !seen) {
          setShowCustomizeWelcome(true);
        }
      }
      if (catRes.status === "fulfilled") setCategories(catRes.value.data);
      if (prodRes.status === "fulfilled") setProducts(prodRes.value.data);
      if (ordRes.status === "fulfilled") setOrders(ordRes.value.data);
    } catch (err) {
      console.error("Failed to load overview data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleStatusUpdate = (e: any) => {
      if (e.detail) {
        setStore((prev: any) => (prev ? { ...prev, status: e.detail } : prev));
      }
    };
    window.addEventListener("store-status-changed", handleStatusUpdate);
    return () => window.removeEventListener("store-status-changed", handleStatusUpdate);
  }, []);

  const handleViewStore = () => {
    if (!isPublished) {
      setShowPublishPopup(true);
      return;
    }
    if (storeSlug) {
      window.open(`/storefront/${storeSlug}`, "_blank");
    }
  };

  const storeSlug = store?.slug || "";
  const isPublished = store?.status === "published";

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + parseFloat(String(o.total_amount) || "0"), 0);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "#6b7280" }}>
        Loading overview metrics...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* ── Top Hero Storefront Banner ─────────────────────────────────── */}
      <div
        className="seller-hero-card"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          padding: "1.75rem 2rem",
          marginBottom: "2rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
        }}
      >
        <div>
          <div className="seller-hero-badge-wrap" style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <span style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              textTransform: "uppercase",
              padding: "0.2rem 0.6rem",
              borderRadius: "9999px",
              backgroundColor: isPublished ? "#ecfdf5" : "#fef3c7",
              color: isPublished ? "#065f46" : "#92400e",
              border: isPublished ? "1px solid #a7f3d0" : "1px solid #fde68a",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              whiteSpace: "nowrap"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: isPublished ? "#10b981" : "#f59e0b" }} />
              <span>{isPublished ? "Live Storefront" : "Draft Setup Mode"}</span>
            </span>
            <span style={{ fontSize: "0.825rem", color: "#6b7280" }}>
              {isPublished ? "Publicly accessible & accepting guest checkouts" : "Only visible to you while configuring"}
            </span>
          </div>

          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#111827", margin: "0" }}>
            {store?.name || "My Store"}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="hero-action-dock" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={handleViewStore}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.65rem 1.25rem",
              borderRadius: "8px",
              backgroundColor: isPublished ? "#ecfdf5" : "#ffffff",
              color: isPublished ? "#065f46" : "#1a5c38",
              border: isPublished ? "1.5px solid #a7f3d0" : "1.5px solid #1a5c38",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.15s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>View Your Publish Store</span>
          </button>

          <Link
            href="/dashboard/products/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.65rem 1.25rem",
              borderRadius: "8px",
              backgroundColor: "#1a5c38",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.875rem",
              textDecoration: "none",
              boxShadow: "0 1px 3px rgba(26,92,56,0.2)"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* ── Key Performance Metrics (PKR Currency + Clean SVGs) ────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2rem"
      }}>
        <StatCard
          title="Total Revenue"
          value={`PKR ${totalRevenue.toLocaleString()}`}
          subtitle={`From ${orders.length} total orders`}
          trend="+PKR"
          icon={(
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          )}
        />

        <StatCard
          title="Incoming Orders"
          value={orders.length}
          subtitle={`${orders.filter((o) => o.status === "pending").length} pending fulfillment`}
          icon={(
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          )}
        />

        <StatCard
          title="Active Products"
          value={products.length}
          subtitle="Listed in your storefront"
          icon={(
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          )}
        />

        <StatCard
          title="Categories"
          value={categories.length}
          subtitle="Organizing your catalog"
          icon={(
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          )}
        />
      </div>

      {/* ── Two-Column Activities (Recent Orders + Products) ───────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.5rem" }}>
        {/* Recent Orders */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #e5e7eb",
          padding: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827", margin: 0 }}>
              Recent Orders
            </h3>
            <Link
              href="/dashboard/orders"
              style={{ fontSize: "0.825rem", color: "#1a5c38", fontWeight: 700, textDecoration: "none" }}
            >
              View All Orders &rarr;
            </Link>
          </div>

          {orders.length === 0 ? (
            <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#9ca3af", fontSize: "0.875rem" }}>
              No customer orders received yet. Once guests checkout on your storefront, orders will appear here.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f3f4f6"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>
                      {order.customer_name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {new Date(order.created_at).toLocaleDateString()} &bull; {order.items?.length || 0} items
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111827" }}>
                      PKR {parseFloat(String(order.total_amount) || "0").toLocaleString()}
                    </div>
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      padding: "0.15rem 0.5rem",
                      borderRadius: "9999px",
                      textTransform: "uppercase",
                      backgroundColor: order.status === "completed" ? "#ecfdf5" : order.status === "pending" ? "#fef3c7" : "#f3f4f6",
                      color: order.status === "completed" ? "#065f46" : order.status === "pending" ? "#92400e" : "#374151"
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Catalog Snapshot */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #e5e7eb",
          padding: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827", margin: 0 }}>
              Catalog Snapshot
            </h3>
            <Link
              href="/dashboard/products"
              style={{ fontSize: "0.825rem", color: "#1a5c38", fontWeight: 700, textDecoration: "none" }}
            >
              All Products &rarr;
            </Link>
          </div>

          {products.length === 0 ? (
            <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#9ca3af", fontSize: "0.875rem" }}>
              No products created yet. Add products to populate your storefront.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {products.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f3f4f6"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Stock: {p.stock_quantity} units
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#1a5c38" }}>
                    PKR {parseFloat(String(p.price) || "0").toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Screen Pop-up for Unpublished Store */}
      {showPublishPopup && (
        <div
          onClick={() => setShowPublishPopup(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1.25rem"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "26px",
              padding: "2.5rem 2rem",
              maxWidth: "430px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid rgba(229, 231, 235, 0.8)"
            }}
          >
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "18px",
              backgroundColor: "#fef3c7",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem auto",
              boxShadow: "0 4px 12px rgba(217, 119, 6, 0.15)"
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
              Store Not Published
            </h3>
            <p style={{ fontSize: "0.925rem", color: "#64748b", marginBottom: "1.75rem", lineHeight: 1.6 }}>
              First you can publish your store, your store is not published yet.
            </p>
            <button
              type="button"
              onClick={() => setShowPublishPopup(false)}
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "14px",
                backgroundColor: "#1a5c38",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(26, 92, 56, 0.3)"
              }}
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* ── First-Time Seller Onboarding Modal: Customize Your Store ──── */}
      {showCustomizeWelcome && (
        <div
          onClick={() => setShowCustomizeWelcome(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "1.25rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "26px",
              padding: "2.5rem 2rem",
              maxWidth: "460px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(229, 231, 235, 0.8)",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                backgroundColor: "#ecfdf5",
                color: "#1a5c38",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem auto",
                boxShadow: "0 4px 12px rgba(26, 92, 56, 0.15)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>
              Customize Your Store First
            </h3>
            <p style={{ fontSize: "0.925rem", color: "#64748b", marginBottom: "1.75rem", lineHeight: 1.6 }}>
              Welcome to Merchant Bazaar! Before your store can go live, please set up your store branding — upload your logo, choose brand colors, and add a hero banner.
            </p>
            <Link
              href="/dashboard/store/customize"
              onClick={() => {
                if (typeof window !== "undefined" && store?.id) {
                  sessionStorage.setItem(`mb_cust_seen_${store.id}`, "true");
                }
                setShowCustomizeWelcome(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.85rem 1.5rem",
                borderRadius: "14px",
                backgroundColor: "#1a5c38",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(26, 92, 56, 0.3)",
              }}
            >
              <span>Customize Store Now</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && store?.id) {
                  sessionStorage.setItem(`mb_cust_seen_${store.id}`, "true");
                }
                setShowCustomizeWelcome(false);
              }}
              style={{
                marginTop: "0.85rem",
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: "0.4rem 0.8rem",
              }}
            >
              I&apos;ll do this later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
