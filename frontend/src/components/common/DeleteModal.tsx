"use client";

import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteModal({
  isOpen,
  title = "Delete Confirmation",
  itemName,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={loading ? undefined : onCancel}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(4px)",
          transition: "opacity 0.2s ease",
        }}
      />

      {/* Modal Dialog Card */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "440px",
          padding: "1.75rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #f1f5f9",
          zIndex: 10000,
          animation: "modalSlideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Warning Icon Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1rem" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>

          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {title}
            </h3>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.15rem" }}>
              Permanent deletion
            </div>
          </div>
        </div>

        {/* Content Message */}
        <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.5, margin: "0 0 1.5rem 0" }}>
          {message || (
            <>
              Are you sure you want to delete{" "}
              {itemName ? <strong style={{ color: "#0f172a" }}>&ldquo;{itemName}&rdquo;</strong> : "this item"}?
              This action cannot be undone and will permanently remove it from your store.
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "0.55rem 1.15rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#334155",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "0.55rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 4px rgba(220, 38, 38, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
            }}
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
