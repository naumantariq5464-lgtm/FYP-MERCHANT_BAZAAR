"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import api from "@/lib/api";

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  helpText?: string;
  minWidth?: number;
  minHeight?: number;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  folder = "merchant_bazaar",
  helpText,
  minWidth,
  minHeight,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WEBP, GIF)");
      return;
    }

    // Verify image dimensions if minWidth / minHeight specified
    if (minWidth || minHeight) {
      const isValid = await new Promise<boolean>((resolve) => {
        const img = new window.Image();
        const objUrl = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(objUrl);
          if (minWidth && img.width < minWidth) {
            setError(`Image width (${img.width}px) is too small. Please upload a landscape image with at least ${minWidth}px width (Recommended: 1200 × 400 px) for optimal fit.`);
            resolve(false);
          } else if (minHeight && img.height < minHeight) {
            setError(`Image height (${img.height}px) is too small. Please upload an image with at least ${minHeight}px height for optimal fit.`);
            resolve(false);
          } else {
            resolve(true);
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(objUrl);
          resolve(true);
        };
        img.src = objUrl;
      });

      if (!isValid) return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(`/upload/image?folder=${encodeURIComponent(folder)}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.url) {
        onChange(res.data.url);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed. Please check network and try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.35rem" }}>
        {label}
      </label>

      {helpText && (
        <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.5rem" }}>
          {helpText}
        </div>
      )}

      {value ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0.85rem",
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "80px",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "#e2e8f0",
              flexShrink: 0,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <Image
              src={value}
              alt="Uploaded image"
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#10b981" }} />
              <span style={{ fontSize: "0.8rem", color: "#065f46", fontWeight: 700 }}>
                Uploaded to Cloudinary
              </span>
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {value}
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  padding: "0.3rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  color: "#334155",
                }}
              >
                {uploading ? "Uploading..." : "Replace Image"}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  padding: "0.3rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #fecaca",
                  backgroundColor: "#fef2f2",
                  cursor: "pointer",
                  color: "#dc2626",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? "2px dashed #1a5c38" : "2px dashed #cbd5e1",
            backgroundColor: dragActive ? "#ecfdf5" : "#f8fafc",
            borderRadius: "12px",
            padding: "1.75rem 1rem",
            textAlign: "center",
            cursor: uploading ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {uploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a5c38" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10" />
              </svg>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1a5c38" }}>
                Uploading directly to Cloudinary...
              </span>
            </div>
          ) : (
            <div>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "#e2e8f0",
                  color: "#475569",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.75rem auto",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>
                Click to upload or drag image here
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
                PNG, JPG, WEBP, or GIF (auto-optimized & saved to Cloudinary)
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {error && (
        <div style={{ fontSize: "0.75rem", color: "#dc2626", marginTop: "0.35rem", fontWeight: 600 }}>
          {error}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
