"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartContext";
import api from "@/lib/api";

function CheckoutContent({ slug }: { slug: string }) {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [storeName, setStoreName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1a5c38");

  useEffect(() => {
    // Fetch store profile to show branding
    api.get(`/public/stores/${slug}`)
      .then((res) => {
        setStoreName(res.data.name || "Store");
        if (res.data.settings?.primary_color) {
          setPrimaryColor(res.data.settings.primary_color);
        }
      })
      .catch(() => {});
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg("Your cart is empty. Please add products before checking out.");
      return;
    }

    setErrorMsg("");
    setSubmitting(true);

    try {
      const payload = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: customerPhone.trim(),
        delivery_address: deliveryAddress.trim(),
        items: items.map((i) => ({
          product_id: i.product_id,
          variant_id: i.variant_id || null,
          quantity: i.quantity,
        })),
      };

      const res = await api.post(`/public/stores/${slug}/orders`, payload);
      clearCart();
      router.push(`/storefront/${slug}/order-confirmed?orderId=${res.data.id}`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Could not place order. Please check inventory and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8faf9", fontFamily: "var(--font-geist-sans), sans-serif" }}>
      {/* Header */}
      <header style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <Link href={`/storefront/${slug}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111827" }}>
            {storeName || "Store"}
          </span>
          <span style={{ color: "#9ca3af" }}>/</span>
          <span style={{ fontSize: "0.95rem", color: "#6b7280" }}>Checkout</span>
        </Link>

        <Link
          href={`/storefront/${slug}`}
          style={{ fontSize: "0.875rem", color: primaryColor, fontWeight: 600, textDecoration: "none" }}
        >
          &larr; Back to Store
        </Link>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1000px", margin: "2rem auto", padding: "0 1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
          Guest Checkout
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "2rem" }}>
          Provide your delivery details below to finalize your order with Cash on Delivery.
        </p>

        {errorMsg && (
          <div style={{
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            padding: "0.85rem 1rem",
            borderRadius: "8px",
            fontSize: "0.875rem",
            marginBottom: "1.5rem"
          }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", alignItems: "start" }}>
          {/* Shipping Form */}
          <form onSubmit={handleSubmit} style={{
            backgroundColor: "#ffffff",
            padding: "1.75rem",
            borderRadius: "14px",
            border: "1px solid #e5e7eb"
          }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#111827", marginBottom: "1.25rem" }}>
              1. Delivery Information
            </h2>

            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ali Ahmed"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="ali@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +92 300 1234567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
                Complete Delivery Address *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Street address, apartment/house number, city, postal code..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db", fontFamily: "inherit" }}
              />
            </div>

            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#111827", marginBottom: "0.75rem" }}>
              2. Payment Method
            </h2>
            <div style={{
              padding: "0.85rem 1rem",
              borderRadius: "8px",
              border: `2px solid ${primaryColor}`,
              backgroundColor: "#f0fdf4",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem"
            }}>
              <span style={{ fontSize: "1.2rem" }}>💵</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>Cash on Delivery (COD)</div>
                <div style={{ fontSize: "0.775rem", color: "#4b5563" }}>Pay with cash when your package is delivered to your doorstep.</div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "8px",
                backgroundColor: primaryColor,
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "1rem",
                border: "none",
                cursor: items.length === 0 ? "not-allowed" : "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              {submitting ? "Placing Order..." : `Place Order — PKR ${totalAmount.toLocaleString()}`}
            </button>
          </form>

          {/* Order Summary */}
          <div style={{
            backgroundColor: "#ffffff",
            padding: "1.75rem",
            borderRadius: "14px",
            border: "1px solid #e5e7eb"
          }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#111827", marginBottom: "1.25rem" }}>
              Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
            </h2>

            {items.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                Your cart is empty.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                {items.map((i) => (
                  <div key={`${i.product_id}-${i.variant_id || "base"}`} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "6px",
                      backgroundColor: "#f3f4f6",
                      overflow: "hidden",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {i.image_url ? (
                        <img src={i.image_url} alt={i.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#111827" }}>{i.product_name}</div>
                      {i.variant_info && (
                        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{i.variant_info}</div>
                      )}
                      <div style={{ fontSize: "0.8rem", color: "#4b5563" }}>Qty: {i.quantity} &times; PKR {i.price.toLocaleString()}</div>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>
                      PKR {(i.price * i.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                <span>Subtotal</span>
                <span>PKR {totalAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#6b7280", marginBottom: "0.75rem" }}>
                <span>Shipping</span>
                <span style={{ color: "#065f46", fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: 800, color: "#111827" }}>
                <span>Total Due</span>
                <span>PKR {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CheckoutWrapper() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  return (
    <CartProvider storeSlug={slug}>
      <CheckoutContent slug={slug} />
    </CartProvider>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8faf9" }}>
        <div style={{ color: "#1a5c38", fontWeight: 600 }}>Loading checkout...</div>
      </div>
    }>
      <CheckoutWrapper />
    </React.Suspense>
  );
}
