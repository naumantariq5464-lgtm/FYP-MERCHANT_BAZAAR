"use client";

import React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

function OrderConfirmedContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || "";
  const orderId = searchParams.get("orderId") || "";

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8faf9",
      fontFamily: "var(--font-geist-sans), sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <div style={{
        maxWidth: "540px",
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        padding: "3rem 2rem",
        textAlign: "center",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)"
      }}>
        {/* Success Icon */}
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          backgroundColor: "#ecfdf5",
          color: "#059669",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.25rem",
          margin: "0 auto 1.5rem auto",
          border: "2px solid #a7f3d0"
        }}>
          ✓
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", margin: "0 0 0.5rem 0" }}>
          Order Placed Successfully!
        </h1>

        <p style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.6, margin: "0 0 1.5rem 0" }}>
          Thank you for your purchase. The store merchant has received your order details and is preparing it for delivery via Cash on Delivery.
        </p>

        {orderId && (
          <div style={{
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            padding: "0.85rem",
            marginBottom: "2rem"
          }}>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 700 }}>
              Order Reference ID
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", marginTop: "0.2rem" }}>
              {orderId}
            </div>
          </div>
        )}

        <Link
          href={`/storefront/${slug}`}
          className="btn btn-primary"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 700
          }}
        >
          &larr; Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <React.Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8faf9" }}>
        <div style={{ color: "#1a5c38", fontWeight: 600 }}>Loading confirmation...</div>
      </div>
    }>
      <OrderConfirmedContent />
    </React.Suspense>
  );
}
