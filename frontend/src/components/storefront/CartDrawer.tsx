"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  storeSlug: string;
  primaryColor?: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  storeSlug,
  primaryColor = "#1a5c38",
}: CartDrawerProps) {
  const { items, removeItem, updateQuantity, updateVariant, totalItems, totalAmount } = useCart();

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", justifyContent: "flex-end" }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(2px)",
          transition: "opacity 0.2s ease"
        }}
      />

      {/* Slide-out Panel */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "420px",
        height: "100%",
        backgroundColor: "#ffffff",
        boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
        display: "flex",
        flexDirection: "column",
        zIndex: 10000,
        animation: "slideIn 0.25s ease-out"
      }}>
        {/* Header */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111827" }}>Your Shopping Cart</span>
            <span style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              backgroundColor: "#f3f4f6",
              color: "#374151",
              padding: "0.15rem 0.5rem",
              borderRadius: "9999px"
            }}>
              {totalItems}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#6b7280",
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#6b7280" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ margin: "0 auto 1rem auto" }}>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", marginBottom: "0.25rem" }}>
                Your cart is empty
              </div>
              <p style={{ fontSize: "0.875rem" }}>Discover products and add them to your cart.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.map((item) => (
                <div
                  key={`${item.product_id}-${item.variant_id || "base"}`}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid #f3f4f6",
                    alignItems: "center"
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    backgroundColor: "#f3f4f6",
                    overflow: "hidden",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.75">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.925rem", color: "#111827" }}>
                      {item.product_name}
                    </div>
                    {/* Variant Display / Selector */}
                    {item.available_variants && item.available_variants.length > 1 ? (
                      <div style={{ marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <select
                          value={item.variant_id}
                          onChange={(e) => {
                            const selected = item.available_variants?.find((v) => v.id === e.target.value);
                            if (selected && updateVariant) {
                              updateVariant(item.product_id, item.variant_id, selected, item.base_price ?? item.price);
                            }
                          }}
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.2rem 0.45rem",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                            backgroundColor: "#f9fafb",
                            color: "#374151",
                            cursor: "pointer",
                            fontWeight: 600
                          }}
                        >
                          {item.available_variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.variant_type}: {v.variant_value} {v.extra_price > 0 ? `(+PKR ${v.extra_price.toLocaleString()})` : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : item.variant_info ? (
                      <div style={{
                        display: "inline-block",
                        fontSize: "0.75rem",
                        color: "#166534",
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        marginTop: "0.25rem",
                        fontWeight: 600
                      }}>
                        {item.variant_info}
                      </div>
                    ) : null}
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827", marginTop: "0.25rem" }}>
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </div>

                    {/* Quantity Selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem" }}>
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px"
                      }}>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)}
                          style={{
                            padding: "0.2rem 0.5rem",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            color: "#374151"
                          }}
                        >
                          -
                        </button>
                        <span style={{ padding: "0 0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                          style={{
                            padding: "0.2rem 0.5rem",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            color: "#374151"
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product_id, item.variant_id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          marginLeft: "auto"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.95rem", color: "#4b5563" }}>Estimated Subtotal</span>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111827" }}>
                PKR {totalAmount.toLocaleString()}
              </span>
            </div>

            <Link
              href={`/storefront/${storeSlug}/checkout`}
              onClick={onClose}
              style={{
                display: "block",
                textAlign: "center",
                backgroundColor: primaryColor,
                color: "#ffffff",
                padding: "0.75rem",
                borderRadius: "8px",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              Proceed to Checkout &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
