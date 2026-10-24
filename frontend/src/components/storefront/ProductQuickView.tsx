"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

interface Variant {
  id: string;
  variant_type: string;
  variant_value: string;
  extra_price: string | number;
  stock_qty: number;
}

interface ProductImage {
  id: string;
  image_url: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  stock_quantity: number;
  images: ProductImage[];
  variants: Variant[];
}

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  primaryColor?: string;
  onAddToCartSuccess?: () => void;
}

export default function ProductQuickView({
  product,
  onClose,
  primaryColor = "#1a5c38",
  onAddToCartSuccess,
}: ProductQuickViewProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const basePrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const extraPrice = selectedVariant
    ? (typeof selectedVariant.extra_price === "string" ? parseFloat(selectedVariant.extra_price) : selectedVariant.extra_price)
    : 0;
  const finalPrice = basePrice + extraPrice;

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      product_name: product.name,
      image_url: product.images?.[0]?.image_url || null,
      price: finalPrice,
      quantity,
      variant_id: selectedVariant?.id,
      variant_info: selectedVariant ? `${selectedVariant.variant_type}: ${selectedVariant.variant_value}` : undefined,
    });

    onClose();
    if (onAddToCartSuccess) {
      onAddToCartSuccess();
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(3px)"
        }}
      />

      {/* Modal Box */}
      <div style={{
        position: "relative",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        zIndex: 9999,
        padding: "2rem",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "#6b7280",
            cursor: "pointer",
            lineHeight: 1
          }}
        >
          &times;
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.75rem" }}>
          {/* Product Image */}
          <div style={{
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#f9fafb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "240px",
            border: "1px solid #f3f4f6"
          }}>
            {product.images?.[0]?.image_url ? (
              <img
                src={product.images[0].image_url}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#111827", margin: "0 0 0.5rem 0" }}>
              {product.name}
            </h2>

            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: primaryColor, marginBottom: "0.75rem" }}>
              PKR {finalPrice.toLocaleString()}
            </div>

            {product.description && (
              <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                {product.description}
              </p>
            )}

            {/* Variants Picker */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#374151", marginBottom: "0.5rem" }}>
                  Select Option:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const vExtra = typeof v.extra_price === "string" ? parseFloat(v.extra_price) : v.extra_price;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(isSelected ? null : v)}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "8px",
                          border: isSelected ? `2px solid ${primaryColor}` : "1px solid #d1d5db",
                          backgroundColor: isSelected ? "#f0fdf4" : "#ffffff",
                          color: isSelected ? primaryColor : "#374151",
                          fontWeight: 600,
                          fontSize: "0.825rem",
                          cursor: "pointer"
                        }}
                      >
                        {v.variant_value} {vExtra > 0 ? `(+PKR ${vExtra.toLocaleString()})` : ""}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>Quantity:</span>
              <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "6px" }}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: "0.25rem 0.6rem", border: "none", background: "none", cursor: "pointer", fontSize: "1rem" }}
                >
                  -
                </button>
                <span style={{ padding: "0 0.6rem", fontSize: "0.9rem", fontWeight: 700 }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ padding: "0.25rem 0.6rem", border: "none", background: "none", cursor: "pointer", fontSize: "1rem" }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "8px",
                backgroundColor: primaryColor,
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              Add to Cart &bull; PKR {(finalPrice * quantity).toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
