"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import ImageUpload from "@/components/common/ImageUpload";

interface Category {
  id: string;
  name: string;
}

interface VariantRow {
  variant_type: string;
  variant_value: string;
  extra_price: string;
  stock_qty: number;
}

export default function NewProductPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("10");
  const [status, setStatus] = useState("active");
  const [imageUrl, setImageUrl] = useState("");
  const [variants, setVariants] = useState<VariantRow[]>([]);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
      return;
    }
    if (user) {
      loadCategories();
    }
  }, [user, isLoading, router]);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
      if (res.data.length > 0) {
        setCategoryId(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const addVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      { variant_type: "Size", variant_value: "", extra_price: "0", stock_qty: 10 },
    ]);
  };

  const removeVariantRow = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariantRow = (index: number, field: keyof VariantRow, value: any) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Product name is required.");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setErrorMsg("Please enter a valid price in PKR greater than 0.");
      return;
    }

    setErrorMsg("");
    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        category_id: categoryId || undefined,
        price: parseFloat(price),
        stock_quantity: parseInt(stockQuantity, 10) || 0,
        status,
        images: imageUrl.trim() ? [imageUrl.trim()] : [],
        variants: variants
          .filter((v) => v.variant_value.trim())
          .map((v) => ({
            variant_type: v.variant_type,
            variant_value: v.variant_value.trim(),
            extra_price: parseFloat(v.extra_price) || 0,
            stock_qty: v.stock_qty || 0,
          })),
      };

      await api.post("/products", payload);
      router.push("/dashboard/products");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", margin: 0 }}>
          Create New Product
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
          Enter product details, pricing in PKR, Cloudinary product imagery, and variants.
        </p>
      </div>

      {errorMsg && (
        <div style={{
          background: "#fef2f2",
          color: "#991b1b",
          border: "1px solid #fecaca",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          fontSize: "0.875rem",
          marginBottom: "1.5rem"
        }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Details Card */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "1.75rem",
          marginBottom: "1.5rem"
        }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", marginBottom: "1.25rem" }}>
            Basic Information
          </h2>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
              Product Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Lawn Embroidered 3-Piece Suit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe your product's key features, fabric, and specifications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#ffffff" }}
              >
                <option value="">-- No Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#ffffff" }}
              >
                <option value="active">Active (Visible in Storefront)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing in PKR & Inventory */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "1.75rem",
          marginBottom: "1.5rem"
        }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", marginBottom: "1.25rem" }}>
            Pricing & Inventory
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
                Price (PKR / Rs.) *
              </label>
              <input
                type="number"
                step="1"
                placeholder="2499"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
                Available Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
              />
            </div>
          </div>
        </div>

        {/* Cloudinary Image Upload Card */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "1.75rem",
          marginBottom: "1.5rem"
        }}>
          <ImageUpload
            label="Product Image (Uploads to Cloudinary)"
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            folder="merchant_bazaar/products"
            helpText="Upload a product photo. It will automatically upload to Cloudinary and link to your PostgreSQL store catalog."
          />
        </div>

        {/* Variants Card */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "1.75rem",
          marginBottom: "2rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", margin: 0 }}>
                Variants (Optional)
              </h2>
              <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: "0.2rem 0 0 0" }}>
                Add options like Size (S, M, L) or Color with optional extra price in PKR.
              </p>
            </div>
            <button
              type="button"
              onClick={addVariantRow}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              + Add Option
            </button>
          </div>

          {variants.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {variants.map((v, idx) => (
                <div key={idx} style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <select
                    value={v.variant_type}
                    onChange={(e) => updateVariantRow(idx, "variant_type", e.target.value)}
                    style={{ padding: "0.45rem", borderRadius: "6px", border: "1px solid #d1d5db", width: "100px" }}
                  >
                    <option value="Size">Size</option>
                    <option value="Color">Color</option>
                    <option value="Material">Material</option>
                  </select>

                  <input
                    type="text"
                    placeholder="e.g. XL or Navy"
                    value={v.variant_value}
                    onChange={(e) => updateVariantRow(idx, "variant_value", e.target.value)}
                    style={{ padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid #d1d5db", flex: 1 }}
                  />

                  <input
                    type="number"
                    step="1"
                    placeholder="+ PKR"
                    value={v.extra_price}
                    onChange={(e) => updateVariantRow(idx, "extra_price", e.target.value)}
                    style={{ padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid #d1d5db", width: "90px" }}
                  />

                  <input
                    type="number"
                    min="0"
                    placeholder="Qty"
                    value={v.stock_qty}
                    onChange={(e) => updateVariantRow(idx, "stock_qty", parseInt(e.target.value, 10) || 0)}
                    style={{ padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid #d1d5db", width: "70px" }}
                  />

                  <button
                    type="button"
                    onClick={() => removeVariantRow(idx)}
                    style={{ background: "none", border: "none", color: "#dc2626", fontSize: "1.25rem", cursor: "pointer", padding: "0 0.5rem" }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Link
            href="/dashboard/products"
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              backgroundColor: "#ffffff",
              color: "#374151",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.875rem"
            }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: "8px",
              backgroundColor: "#1a5c38",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer"
            }}
          >
            {saving ? "Saving Product..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
