"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import DeleteModal from "@/components/common/DeleteModal";

interface ProductImage {
  id: string;
  image_url: string;
}

interface Product {
  id: string;
  name: string;
  category_id?: string;
  category_name?: string;
  price: string;
  stock_quantity: number;
  status: string;
  images: ProductImage[];
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Delete Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
      return;
    }
    if (user) {
      loadData();
    }
  }, [user, isLoading, router]);

  const loadData = async (catId?: string) => {
    try {
      setLoading(true);
      const params: any = {};
      if (catId) params.category_id = catId;

      const [prodsRes, catsRes] = await Promise.all([
        api.get("/products", { params }),
        api.get("/categories"),
      ]);
      setProducts(prodsRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (catId: string) => {
    setSelectedCategory(catId);
    loadData(catId || undefined);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/products/${productToDelete.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
    } catch (err) {
      alert("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Title bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "1.5rem"
      }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", margin: 0 }}>
            Store Products
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.25rem" }}>
            Manage your inventory, pricing in PKR, variants, and product images.
          </p>
        </div>

        {/* Category Filter & Add Product */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              style={{
                padding: "0.55rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "0.875rem",
                backgroundColor: "#ffffff"
              }}
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}

          <Link
            href="/dashboard/products/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.55rem 1.15rem",
              borderRadius: "8px",
              backgroundColor: "#1a5c38",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 700,
              textDecoration: "none"
            }}
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Products Table Card */}
      <div style={{
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        overflow: "hidden"
      }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
              No products found
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>
              {selectedCategory ? "No products in this category." : "You have not added any products to your catalog yet."}
            </p>
            <Link
              href="/dashboard/products/new"
              style={{
                display: "inline-block",
                padding: "0.6rem 1.25rem",
                backgroundColor: "#1a5c38",
                color: "#ffffff",
                borderRadius: "8px",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.9rem"
              }}
            >
              + Create Your First Product
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", color: "#4b5563" }}>
                  <th style={{ padding: "0.75rem 1rem" }}>Product</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Category</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Price</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Stock</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "8px",
                          backgroundColor: "#f3f4f6",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}>
                          {prod.images?.[0]?.image_url ? (
                            <img
                              src={prod.images[0].image_url}
                              alt={prod.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "#111827" }}>{prod.name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "0.9rem 1rem", color: "#6b7280" }}>
                      {prod.category_name || "Uncategorized"}
                    </td>
                    <td style={{ padding: "0.9rem 1rem", fontWeight: 700, color: "#111827" }}>
                      PKR {parseFloat(prod.price).toLocaleString()}
                    </td>
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <span style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: prod.stock_quantity > 0 ? "#065f46" : "#991b1b",
                        background: prod.stock_quantity > 0 ? "#ecfdf5" : "#fef2f2",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px"
                      }}>
                        {prod.stock_quantity} in stock
                      </span>
                    </td>
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <span style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: prod.status === "active" ? "#065f46" : "#6b7280",
                        background: prod.status === "active" ? "#d1fae5" : "#f3f4f6",
                        padding: "0.2rem 0.55rem",
                        borderRadius: "9999px"
                      }}>
                        {prod.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.9rem 1rem", textAlign: "right" }}>
                      <button
                        onClick={() => setProductToDelete(prod)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#dc2626",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full-Screen Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!productToDelete}
        title="Delete Product"
        itemName={productToDelete?.name}
        loading={deleting}
        onConfirm={confirmDeleteProduct}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
