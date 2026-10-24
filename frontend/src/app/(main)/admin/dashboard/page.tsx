"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import AdminSidebar, { AdminTabKey } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/dashboard/StatCard";
import Preloader from "@/components/common/Preloader";

interface PlatformStats {
  total_stores: number;
  published_stores: number;
  draft_stores: number;
  total_users: number;
  total_products: number;
  total_orders: number;
}

interface AdminStore {
  id: string;
  name: string;
  slug: string;
  status: string;
  seller_name: string;
  seller_email: string;
  products_count: number;
  orders_count: number;
  created_at: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  store_name?: string | null;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, isLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTabKey>("overview");
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, isAdmin, isLoading, router]);

  const fetchData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [statsRes, storesRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/stores"),
        api.get("/admin/users"),
      ]);
      setStats(statsRes.data);
      setStores(storesRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Failed to load admin platform data:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin, fetchData]);

  const handleToggleStoreStatus = async (storeId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    try {
      setActionLoadingId(storeId);
      await api.put(`/admin/stores/${storeId}/status`, { status: nextStatus });
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, status: nextStatus } : s))
      );
      const statsRes = await api.get("/admin/stats");
      setStats(statsRes.data);
    } catch (err) {
      alert("Failed to update store status. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isLoading || !isAdmin) {
    return <Preloader label="Authenticating Super Admin session..." size={44} fullScreen={true} />;
  }

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.seller_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8faf9", display: "flex", fontFamily: "var(--font-geist-sans), sans-serif" }}>
      {/* Modular Dark Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        storesCount={stores.length}
        usersCount={users.length}
        adminEmail={user?.email}
        onLogout={logout}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Admin Workspace */}
      <div style={{ flex: 1, marginLeft: "260px", minWidth: 0, display: "flex", flexDirection: "column" }} className="admin-main-wrapper">
        <AdminHeader
          activeTab={activeTab}
          loading={loadingData}
          onRefresh={fetchData}
          onOpenMobile={() => setMobileMenuOpen(true)}
        />

        <main style={{ flex: 1, padding: "2rem", maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.25rem",
                marginBottom: "2rem"
              }}>
                <StatCard
                  title="Total Stores"
                  value={stats?.total_stores ?? 0}
                  subtitle={`${stats?.published_stores ?? 0} Live · ${stats?.draft_stores ?? 0} Draft`}
                  icon={(
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  )}
                />

                <StatCard
                  title="Platform Merchants"
                  value={stats?.total_users ?? 0}
                  subtitle="Registered merchant accounts"
                  icon={(
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  )}
                />
              </div>

              {/* Recent Tenant Stores */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e5e7eb", padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", margin: 0 }}>
                      Recent Tenant Stores
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: "0.2rem 0 0 0" }}>
                      Recently created stores and their live publishing status
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("stores")}
                    style={{ background: "none", border: "none", color: "#1a5c38", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    View All &rarr;
                  </button>
                </div>

                {stores.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af", fontSize: "0.875rem" }}>
                    No stores registered yet.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {stores.slice(0, 6).map((s) => (
                      <div
                        key={s.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.9rem 1.25rem",
                          borderRadius: "10px",
                          backgroundColor: "#f9fafb",
                          border: "1px solid #f3f4f6"
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.925rem", color: "#111827" }}>{s.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px" }}>
                            {s.slug}.merchantbazaar.com &bull; Seller: {s.seller_name || s.seller_email}
                          </div>
                        </div>
                        <span style={{
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          padding: "0.22rem 0.6rem",
                          borderRadius: "9999px",
                          textTransform: "uppercase",
                          backgroundColor: s.status === "published" ? "#ecfdf5" : "#fef3c7",
                          color: s.status === "published" ? "#065f46" : "#92400e"
                        }}>
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: STORES GOVERNANCE */}
          {activeTab === "stores" && (
            <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e5e7eb", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111827", margin: 0 }}>
                    Storefronts & Multi-Tenant Registry
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: "0.25rem 0 0 0" }}>
                    Audit tenant stores, manage live visibility, and test storefront routing.
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="Search by store name, slug, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "0.85rem",
                    width: "300px",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left", color: "#6b7280", fontSize: "0.75rem", textTransform: "uppercase" }}>
                      <th style={{ padding: "0.75rem 1rem" }}>Store Details</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Merchant / Owner</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Catalog</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Orders</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Governance Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStores.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "2.5rem", textAlign: "center", color: "#9ca3af" }}>
                          No stores match your search query.
                        </td>
                      </tr>
                    ) : (
                      filteredStores.map((s) => (
                        <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "1rem" }}>
                            <div style={{ fontWeight: 800, color: "#111827" }}>{s.name}</div>
                            <Link
                              href={`/storefront/${s.slug}`}
                              target="_blank"
                              style={{ fontSize: "0.78rem", color: "#2563eb", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                            >
                              <span>{s.slug}.merchantbazaar.com</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                            </Link>
                          </td>
                          <td style={{ padding: "1rem" }}>
                            <div style={{ fontWeight: 600, color: "#374151" }}>{s.seller_name}</div>
                            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{s.seller_email}</div>
                          </td>
                          <td style={{ padding: "1rem", color: "#111827", fontWeight: 700 }}>
                            {s.products_count} products
                          </td>
                          <td style={{ padding: "1rem", color: "#111827", fontWeight: 700 }}>
                            {s.orders_count} orders
                          </td>
                          <td style={{ padding: "1rem" }}>
                            <span style={{
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              padding: "0.25rem 0.65rem",
                              borderRadius: "9999px",
                              textTransform: "uppercase",
                              backgroundColor: s.status === "published" ? "#ecfdf5" : "#fef3c7",
                              color: s.status === "published" ? "#065f46" : "#92400e",
                              border: s.status === "published" ? "1px solid #a7f3d0" : "1px solid #fde68a"
                            }}>
                              {s.status === "published" ? "Live" : "Draft"}
                            </span>
                          </td>
                          <td style={{ padding: "1rem", textAlign: "right" }}>
                            <button
                              onClick={() => handleToggleStoreStatus(s.id, s.status)}
                              disabled={actionLoadingId === s.id}
                              style={{
                                padding: "0.4rem 0.85rem",
                                borderRadius: "6px",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                border: s.status === "published" ? "1px solid #d1d5db" : "none",
                                backgroundColor: s.status === "published" ? "#ffffff" : "#1a5c38",
                                color: s.status === "published" ? "#374151" : "#ffffff",
                                cursor: "pointer"
                              }}
                            >
                              {actionLoadingId === s.id
                                ? "Saving..."
                                : s.status === "published"
                                ? "Set to Draft"
                                : "Publish"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MERCHANTS */}
          {activeTab === "users" && (
            <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e5e7eb", padding: "1.5rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111827", margin: 0 }}>
                  Merchants
                </h2>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: "0.25rem 0 0 0" }}>
                  All registered merchants and user accounts across the platform.
                </p>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left", color: "#6b7280", fontSize: "0.75rem", textTransform: "uppercase" }}>
                      <th style={{ padding: "0.75rem 1rem" }}>User</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Role</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Store</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "1rem" }}>
                          <div style={{ fontWeight: 800, color: "#111827" }}>{u.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>{u.email}</div>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.55rem",
                            borderRadius: "6px",
                            backgroundColor: "#f3f4f6",
                            color: "#374151",
                            textTransform: "uppercase"
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", color: "#111827", fontWeight: 600 }}>
                          {u.store_name || <span style={{ color: "#9ca3af" }}>No store linked</span>}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: u.is_active ? "#15803d" : "#b91c1c"
                          }}>
                            ● {u.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", color: "#6b7280", fontSize: "0.8rem" }}>
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-main-wrapper {
            margin-left: 0 !important;
          }
          .admin-hamburger {
            display: block !important;
          }
          .admin-sidebar-close {
            display: block !important;
          }
          .admin-main-wrapper main {
            padding: 1.25rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
