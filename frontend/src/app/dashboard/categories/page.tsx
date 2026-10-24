"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import DeleteModal from "@/components/common/DeleteModal";

interface Category {
  id: string;
  name: string;
  products_count: number;
  created_at: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Delete Modal State
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setErrorMsg("");
    setCreating(true);
    try {
      const res = await api.post("/categories", { name: newCategoryName.trim() });
      setCategories((prev) => [...prev, res.data]);
      setNewCategoryName("");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const res = await api.put(`/categories/${id}`, { name: editName.trim() });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: res.data.name } : c))
      );
      setEditingId(null);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update category name");
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/categories/${categoryToDelete.id}`);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setCategoryToDelete(null);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", margin: 0 }}>
          Manage Categories
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.25rem" }}>
          Categories help customers browse your storefront and filter products easily.
        </p>
      </div>

      {/* Add Category Card */}
      <div style={{
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        padding: "1.5rem",
        marginBottom: "2rem"
      }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "0.75rem" }}>
          Add New Category
        </h2>

        {errorMsg && (
          <div style={{
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            padding: "0.6rem 0.8rem",
            borderRadius: "8px",
            fontSize: "0.85rem",
            marginBottom: "1rem"
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCreateCategory} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="e.g. Shoes, Pret Wear, Accessories..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            style={{
              flex: "1 1 300px",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem"
            }}
          />
          <button
            type="submit"
            disabled={creating || !newCategoryName.trim()}
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: "8px",
              backgroundColor: "#1a5c38",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.875rem",
              border: "none",
              cursor: creating || !newCategoryName.trim() ? "not-allowed" : "pointer"
            }}
          >
            {creating ? "Adding..." : "+ Add Category"}
          </button>
        </form>
      </div>

      {/* Categories List Card */}
      <div style={{
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "1rem 1.5rem",
          background: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
          fontWeight: 700,
          color: "#4b5563",
          fontSize: "0.85rem",
          textTransform: "uppercase",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <span>Category Name</span>
          <span>Products Count & Actions</span>
        </div>

        {loading ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "#6b7280" }}>
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ margin: "0 auto 0.75rem auto" }}>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", marginBottom: "0.25rem" }}>
              No categories yet
            </div>
            <p style={{ fontSize: "0.875rem" }}>Create your first category above to organize your catalog.</p>
          </div>
        ) : (
          <div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid #f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem"
                }}
              >
                <div style={{ flex: 1 }}>
                  {editingId === cat.id ? (
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{
                          padding: "0.4rem 0.75rem",
                          borderRadius: "6px",
                          border: "1px solid #d1d5db",
                          fontSize: "0.9rem"
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(cat.id)}
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: "#1a5c38",
                          color: "#ffffff",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "6px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "#ffffff",
                          color: "#374151",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: "1rem", fontWeight: 600, color: "#111827" }}>
                      {cat.name}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                  <span style={{
                    fontSize: "0.8125rem",
                    background: "#f3f4f6",
                    color: "#4b5563",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "9999px",
                    fontWeight: 600
                  }}>
                    {cat.products_count} {cat.products_count === 1 ? "product" : "products"}
                  </span>

                  {editingId !== cat.id && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditName(cat.name);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#1a5c38",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => setCategoryToDelete(cat)}
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
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-Screen Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!categoryToDelete}
        title="Delete Category"
        itemName={categoryToDelete?.name}
        message={
          categoryToDelete?.products_count && categoryToDelete.products_count > 0
            ? `Are you sure you want to delete "${categoryToDelete.name}"? It contains ${categoryToDelete.products_count} product(s). Those products will become uncategorized.`
            : undefined
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
