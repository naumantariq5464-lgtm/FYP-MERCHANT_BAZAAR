"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

interface OrderItem {
  id: string;
  product_name: string;
  variant_info?: string;
  unit_price: string | number;
  quantity: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: string | number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function SellerOrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
      return;
    }
    if (user) {
      loadOrders();
    }
  }, [user, isLoading, router]);

  const loadOrders = async (filter?: string) => {
    try {
      setLoading(true);
      const params: any = {};
      if (filter) params.status = filter;

      const res = await api.get("/orders", { params });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setStatusFilter(newFilter);
    loadOrders(newFilter || undefined);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: res.data.status } : o))
      );
    } catch (err) {
      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "#fef3c7", text: "#92400e", border: "#fde68a" };
      case "confirmed":
        return { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" };
      case "processing":
        return { bg: "#ede9fe", text: "#6d28d9", border: "#ddd6fe" };
      case "delivered":
        return { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" };
      case "cancelled":
        return { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" };
      default:
        return { bg: "#f3f4f6", text: "#374151", border: "#e5e7eb" };
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Title Bar */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", margin: 0 }}>
            Orders & Fulfillment
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.25rem" }}>
            Review incoming orders, verify customer shipping details, and update tracking status.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.75rem", marginBottom: "1.5rem" }}>
          {[
            { label: "All Orders", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Processing", value: "processing" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleFilterChange(tab.value)}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "8px",
                border: statusFilter === tab.value ? "2px solid #1a5c38" : "1px solid #d1d5db",
                backgroundColor: statusFilter === tab.value ? "#ecfdf5" : "#ffffff",
                color: statusFilter === tab.value ? "#1a5c38" : "#4b5563",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Table Card */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          {loading ? (
            <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#6b7280" }}>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ margin: "0 auto 0.75rem auto" }}>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
                No orders found
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {statusFilter ? `No orders with status "${statusFilter}".` : "Incoming buyer orders placed on your storefront will appear here."}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", color: "#4b5563" }}>
                    <th style={{ padding: "0.85rem 1rem" }}>Order Details</th>
                    <th style={{ padding: "0.85rem 1rem" }}>Customer & Shipping</th>
                    <th style={{ padding: "0.85rem 1rem" }}>Items</th>
                    <th style={{ padding: "0.85rem 1rem" }}>Total (PKR)</th>
                    <th style={{ padding: "0.85rem 1rem" }}>Status</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const badge = getStatusColor(o.status);
                    const formattedDate = new Date(o.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <tr key={o.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "1rem", verticalAlign: "top" }}>
                          <div style={{ fontWeight: 700, color: "#111827" }}>
                            #{o.id.slice(0, 8)}...
                          </div>
                          <div style={{ fontSize: "0.775rem", color: "#6b7280", marginTop: "0.2rem" }}>
                            {formattedDate}
                          </div>
                        </td>

                        <td style={{ padding: "1rem", verticalAlign: "top" }}>
                          <div style={{ fontWeight: 700, color: "#111827" }}>{o.customer_name}</div>
                          <div style={{ fontSize: "0.8rem", color: "#4b5563", marginTop: "0.15rem" }}>{o.customer_phone}</div>
                          <div style={{ fontSize: "0.775rem", color: "#6b7280" }}>{o.customer_email}</div>
                          <div style={{ fontSize: "0.775rem", color: "#374151", marginTop: "0.3rem", maxWidth: "220px", lineHeight: 1.3 }}>
                            {o.delivery_address}
                          </div>
                        </td>

                        <td style={{ padding: "1rem", verticalAlign: "top" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                            {o.items.map((item, idx) => (
                              <div key={idx} style={{ fontSize: "0.8rem", color: "#1f2937" }}>
                                <strong style={{ color: "#111827" }}>{item.quantity}x</strong> {item.product_name}
                                {item.variant_info && (
                                  <span style={{ color: "#6b7280", marginLeft: "0.25rem" }}>({item.variant_info})</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>

                        <td style={{ padding: "1rem", verticalAlign: "top" }}>
                          <div style={{ fontWeight: 800, color: "#111827", fontSize: "1rem" }}>
                            PKR {parseFloat(String(o.total_amount)).toLocaleString()}
                          </div>
                          <span style={{ fontSize: "0.725rem", color: "#065f46", fontWeight: 700 }}>
                            Cash on Delivery
                          </span>
                        </td>

                        <td style={{ padding: "1rem", verticalAlign: "top" }}>
                          <span style={{
                            display: "inline-block",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            padding: "0.25rem 0.6rem",
                            borderRadius: "9999px",
                            backgroundColor: badge.bg,
                            color: badge.text,
                            border: `1px solid ${badge.border}`
                          }}>
                            {o.status}
                          </span>
                        </td>

                        <td style={{ padding: "1rem", verticalAlign: "top", textAlign: "right" }}>
                          <select
                            value={o.status}
                            disabled={updatingId === o.id}
                            onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                            style={{
                              padding: "0.4rem 0.6rem",
                              borderRadius: "6px",
                              border: "1px solid #d1d5db",
                              fontSize: "0.8rem",
                              backgroundColor: "#ffffff",
                              cursor: "pointer"
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </div>
  );
}
