"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import ImageUpload from "@/components/common/ImageUpload";

const COLOR_PRESETS = [
  { name: "Emerald Green", hex: "#1a5c38" },
  { name: "Forest Pine", hex: "#14532d" },
  { name: "Royal Blue", hex: "#2563eb" },
  { name: "Deep Indigo", hex: "#4338ca" },
  { name: "Regal Purple", hex: "#7c3aed" },
  { name: "Crimson Red", hex: "#dc2626" },
  { name: "Rose Pink", hex: "#e11d48" },
  { name: "Sunset Orange", hex: "#ea580c" },
  { name: "Amber Gold", hex: "#d97706" },
  { name: "Ocean Teal", hex: "#0d9488" },
  { name: "Midnight Navy", hex: "#0f172a" },
  { name: "Slate Charcoal", hex: "#334155" },
  { name: "Warm Berry", hex: "#831843" },
  { name: "Espresso Brown", hex: "#78350f" },
];

export default function StoreCustomizePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Store profile fields
  const [storeName, setStoreName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Fashion & Apparel");

  // Settings / Branding fields
  const [logoUrl, setLogoUrl] = useState("");
  const [heroBannerUrl, setHeroBannerUrl] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1a5c38");

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [wasPublished, setWasPublished] = useState(false);
  const [showRepublishModal, setShowRepublishModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
      return;
    }
    if (user) {
      loadStoreSettings();
    }
  }, [user, isLoading, router]);

  const loadStoreSettings = async () => {
    try {
      const res = await api.get("/stores/me");
      const s = res.data;
      setStoreName(s.name || "");
      setSubdomain(s.slug || s.subdomain || "");
      setBusinessCategory(s.business_category || "");
      setWasPublished(s.status === "published");

      if (s.settings) {
        setLogoUrl(s.settings.logo_url || "");
        setHeroBannerUrl(s.settings.hero_banner_url || (s.settings.hero_images && s.settings.hero_images[0]) || "");
        setHeroTitle(s.settings.hero_title || s.settings.hero_heading || "");
        setHeroSubtitle(s.settings.hero_subtitle || s.settings.hero_description || "");
        setPrimaryColor(s.settings.primary_color || "#1a5c38");
      }
    } catch (err) {
      console.error("Failed to load store settings:", err);
    }
  };

  const handlePublishNow = async () => {
    try {
      setPublishing(true);
      const res = await api.post("/stores/me/publish");
      setWasPublished(res.data.status === "published");
      window.dispatchEvent(new CustomEvent("store-status-changed", { detail: res.data.status }));
      setShowRepublishModal(false);
      setSuccessMsg("Your store is now live with your updated branding!");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to make store live.");
    } finally {
      setPublishing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setSaving(true);

    try {
      // 1. Update basic store profile with free-text category
      await api.put("/stores/me", {
        name: storeName.trim(),
        business_category: businessCategory.trim(),
      });

      // 2. Update store settings & branding
      await api.put("/stores/me/settings", {
        logo_url: logoUrl.trim() || undefined,
        hero_banner_url: heroBannerUrl.trim() || undefined,
        hero_images: heroBannerUrl.trim() ? [heroBannerUrl.trim()] : [],
        hero_heading: heroTitle.trim() || undefined,
        hero_description: heroSubtitle.trim() || undefined,
        primary_color: primaryColor,
      });

      if (wasPublished) {
        window.dispatchEvent(new CustomEvent("store-status-changed", { detail: "draft" }));
        setWasPublished(false);
        setShowRepublishModal(true);
      } else {
        setSuccessMsg("Store branding and settings saved successfully!");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Failed to update store settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", margin: 0 }}>
          Storefront Customization
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
          Upload store logo and banner to Cloudinary, choose brand colors, and define your custom business niche.
        </p>
      </div>

      {successMsg && (
        <div style={{
          background: "#ecfdf5",
          color: "#065f46",
          border: "1px solid #a7f3d0",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          fontSize: "0.875rem",
          marginBottom: "1.5rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

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

      {/* Live Storefront Hero Preview Card */}
      <div style={{
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        marginBottom: "2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        background: "#ffffff"
      }}>
        <div style={{
          background: heroBannerUrl ? `url(${heroBannerUrl}) center/cover no-repeat` : primaryColor,
          padding: "2.5rem 2rem",
          color: "#ffffff",
          position: "relative",
          minHeight: "180px",
          display: "flex",
          alignItems: "center"
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundColor: heroBannerUrl ? "rgba(0,0,0,0.55)" : "transparent"
          }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "1.25rem", width: "100%", flexWrap: "wrap" }}>
            {logoUrl ? (
              <div style={{ position: "relative", width: "64px", height: "64px", borderRadius: "12px", overflow: "hidden", background: "#ffffff", padding: "4px", flexShrink: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
                <Image
                  src={logoUrl}
                  alt="Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </div>
            ) : (
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: 800,
                flexShrink: 0
              }}>
                {storeName ? storeName.charAt(0).toUpperCase() : "M"}
              </div>
            )}

            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                {heroTitle || storeName || "My Storefront"}
              </h3>
              <p style={{ fontSize: "0.95rem", opacity: 0.9, margin: "0.3rem 0 0 0", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                {heroSubtitle || "Discover handcrafted quality goods directly from our store."}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "0.75rem 1.5rem", background: "#f9fafb", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            Live Preview &bull; {subdomain ? `${subdomain}.merchantbazaar.com` : "Subdomain pending"} &bull; {businessCategory || "Custom Category"}
          </span>
          <span style={{
            display: "inline-block",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: primaryColor,
            border: "2px solid #ffffff",
            boxShadow: "0 0 3px rgba(0,0,0,0.3)"
          }} title="Theme primary color" />
        </div>
      </div>

      {/* Customization Form */}
      <form onSubmit={handleSubmit}>
        {/* Profile Card */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "1.75rem",
          marginBottom: "1.5rem"
        }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", marginBottom: "1.25rem" }}>
            Store Details
          </h2>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
              Store Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
              Business Category / Niche
            </label>
            <input
              type="text"
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              placeholder="e.g. Women's Luxury Pret, Organic Spices, Leather Goods, Electronics..."
              style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.35rem" }}>
              Type any category or niche of your choice. You are not restricted to dropdown presets.
            </div>
          </div>
        </div>

        {/* Media & Cloudinary Direct Uploads Card */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "1.75rem",
          marginBottom: "1.5rem"
        }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", marginBottom: "1.25rem" }}>
            Storefront Media & Assets
          </h2>

          {/* Store Logo Direct Uploader */}
          <ImageUpload
            label="Store Logo"
            value={logoUrl}
            onChange={(url) => setLogoUrl(url)}
            folder="merchant_bazaar/logos"
            helpText="Click or drag to upload your logo file. Saved directly to Cloudinary."
          />

          {/* Hero Banner Direct Uploader */}
          <ImageUpload
            label="Hero Banner Image"
            value={heroBannerUrl}
            onChange={(url) => setHeroBannerUrl(url)}
            folder="merchant_bazaar/banners"
            minWidth={800}
            minHeight={250}
            helpText="Upload a landscape banner image. Recommended size: 1200 × 400 px (Minimum width: 800 px)."
          />
        </div>

        {/* Branding & Expanded Palette Card */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "1.75rem",
          marginBottom: "2rem"
        }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", marginBottom: "1.25rem" }}>
            Brand Color Palette & Typography
          </h2>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
              Primary Brand Color ({primaryColor})
            </label>

            {/* Custom Picker Row */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                style={{ width: "48px", height: "42px", border: "none", cursor: "pointer", borderRadius: "8px" }}
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#1a5c38"
                style={{ width: "130px", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", textTransform: "uppercase", fontWeight: 700, fontSize: "0.875rem" }}
              />
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Custom Hex Color</span>
            </div>

            {/* Expanded 14 Presets Grid */}
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>
              Or choose from curated brand presets:
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: "0.5rem"
            }}>
              {COLOR_PRESETS.map((preset) => {
                const isSelected = primaryColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setPrimaryColor(preset.hex)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.45rem 0.65rem",
                      borderRadius: "8px",
                      border: isSelected ? "2px solid #0f172a" : "1px solid #e2e8f0",
                      backgroundColor: isSelected ? "#f1f5f9" : "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        backgroundColor: preset.hex,
                        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                        flexShrink: 0
                      }}
                    />
                    <span style={{ fontSize: "0.75rem", fontWeight: isSelected ? 700 : 500, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
              Hero Headline
            </label>
            <input
              type="text"
              placeholder="e.g. Premium Pakistani Couture & Pret"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" }}>
              Hero Subtitle
            </label>
            <input
              type="text"
              placeholder="e.g. Handcrafted unstitched fabrics and luxury prêt wear delivered nationwide."
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Link
            href="/dashboard"
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
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* ── Re-Publish Notification Modal ─────────────────────────────── */}
      {showRepublishModal && (
        <div
          onClick={() => setShowRepublishModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10001,
            padding: "1.25rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "26px",
              padding: "2.5rem 2rem",
              maxWidth: "460px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(229, 231, 235, 0.8)",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "20px",
                backgroundColor: "#ecfdf5",
                color: "#1a5c38",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem auto",
                boxShadow: "0 4px 12px rgba(26, 92, 56, 0.15)",
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
              Branding Saved! Live Your Store
            </h3>
            <p style={{ fontSize: "0.925rem", color: "#64748b", marginBottom: "1.75rem", lineHeight: 1.6 }}>
              Your new store settings and colors have been saved. Your store has been placed in draft mode so you can review changes. Click below to re-publish and push your new look live!
            </p>
            <button
              type="button"
              onClick={handlePublishNow}
              disabled={publishing}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.85rem 1.5rem",
                borderRadius: "14px",
                backgroundColor: "#1a5c38",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(26, 92, 56, 0.3)",
              }}
            >
              <span>{publishing ? "Publishing Store..." : "Live Your Store Now"}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowRepublishModal(false);
                setSuccessMsg("Settings saved! Your store is in draft mode until you publish.");
              }}
              style={{
                marginTop: "0.85rem",
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: "0.4rem 0.8rem",
              }}
            >
              Keep in Draft Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
