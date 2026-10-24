"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import Preloader from "@/components/common/Preloader";

interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  status: string;
  settings?: {
    logo_url?: string;
    hero_images?: string[];
    primary_color?: string;
  };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  const [store, setStore] = useState<StoreInfo | null>(null);
  const [loadingStore, setLoadingStore] = useState(true);
  const [togglingPublish, setTogglingPublish] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [publishWarning, setPublishWarning] = useState<"customize" | "products" | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
      return;
    }
    if (user) {
      loadStore();
    }
  }, [user, isLoading, router]);

  const loadStore = async () => {
    try {
      setLoadingStore(true);
      const res = await api.get("/stores/me");
      setStore(res.data);
    } catch (err) {
      console.error("Failed to load store profile:", err);
    } finally {
      setLoadingStore(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!store) return;

    // Guard rails when attempting to publish from draft
    if (!isPublished) {
      setTogglingPublish(true);
      let currentStore = store;
      try {
        const storeRes = await api.get("/stores/me");
        currentStore = storeRes.data;
        setStore(currentStore);
      } catch (err) {
        // Fallback to cached store
      }

      // 1. Check branding customization
      const isCustomized = Boolean(
        currentStore.settings?.logo_url ||
        (currentStore.settings?.hero_images && currentStore.settings.hero_images.length > 0) ||
        (currentStore.settings?.primary_color && currentStore.settings.primary_color !== "#1a5c38")
      );
      if (!isCustomized) {
        setTogglingPublish(false);
        setPublishWarning("customize");
        return;
      }

      // 2. Check if at least one product exists
      try {
        const prodRes = await api.get("/products");
        if (!prodRes.data || prodRes.data.length === 0) {
          setTogglingPublish(false);
          setPublishWarning("products");
          return;
        }
      } catch (err) {
        // Continue to server validation
      }
    }

    try {
      setTogglingPublish(true);
      const res = await api.post("/stores/me/publish");
      setStore((prev: any) => (prev ? { ...prev, status: res.data.status } : null));
      window.dispatchEvent(new CustomEvent("store-status-changed", { detail: res.data.status }));
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (detail && typeof detail === "string") {
        if (detail.toLowerCase().includes("customize")) {
          setPublishWarning("customize");
        } else if (detail.toLowerCase().includes("product")) {
          setPublishWarning("products");
        } else {
          alert(detail);
        }
      } else {
        alert("Failed to toggle store publication status.");
      }
    } finally {
      setTogglingPublish(false);
    }
  };

  if (isLoading || loadingStore) {
    return <Preloader label="Loading Seller Portal..." size={44} fullScreen={true} />;
  }

  const isPublished = store?.status === "published";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8faf9", display: "flex", fontFamily: "var(--font-geist-sans), sans-serif" }}>
      {/* Modular Left Sidebar */}
      <Sidebar
        store={store}
        userEmail={user?.email}
        onLogout={logout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: "260px", minWidth: 0, display: "flex", flexDirection: "column" }} className="dashboard-main-wrapper">
        <Header
          storeName={store?.name}
          isPublished={isPublished}
          toggling={togglingPublish}
          onTogglePublish={handleTogglePublish}
          onOpenMobile={() => setMobileSidebarOpen(true)}
        />

        <main style={{ flex: 1, padding: "2rem" }}>
          {children}
        </main>
      </div>

      {/* ── Publish Validation Guard-Rail Modal ───────────────────────── */}
      {publishWarning && (
        <div
          onClick={() => setPublishWarning(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10001,
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
            {publishWarning === "customize" ? (
              <>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "20px",
                    backgroundColor: "#fef3c7",
                    color: "#d97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem auto",
                    boxShadow: "0 4px 12px rgba(217, 119, 6, 0.15)",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>
                  Customize Your Store First
                </h3>
                <p style={{ fontSize: "0.925rem", color: "#64748b", marginBottom: "1.75rem", lineHeight: 1.6 }}>
                  Your store cannot be published without branding. Please upload your store logo and set up your banner before making it live.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPublishWarning(null);
                    router.push("/dashboard/store/customize");
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
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(26, 92, 56, 0.3)",
                  }}
                >
                  <span>Customize Store Now</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "20px",
                    backgroundColor: "#fef3c7",
                    color: "#d97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem auto",
                    boxShadow: "0 4px 12px rgba(217, 119, 6, 0.15)",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>
                  Add At Least One Product
                </h3>
                <p style={{ fontSize: "0.925rem", color: "#64748b", marginBottom: "1.75rem", lineHeight: 1.6 }}>
                  A store cannot be published empty. Please add at least one product with price and stock to publish your storefront.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPublishWarning(null);
                    router.push("/dashboard/products/new");
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
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(26, 92, 56, 0.3)",
                  }}
                >
                  <span>Add Your First Product</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setPublishWarning(null)}
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
              Cancel
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 900px) {
          .dashboard-sidebar {
            transform: translateX(-100%);
          }
          .dashboard-main-wrapper {
            margin-left: 0 !important;
          }
          .dashboard-hamburger {
            display: block !important;
          }
          .dashboard-sidebar-close {
            display: block !important;
          }
          .dashboard-main-wrapper main {
            padding: 1.25rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
