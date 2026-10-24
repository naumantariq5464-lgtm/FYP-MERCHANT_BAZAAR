"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartContext";
import CartDrawer from "@/components/storefront/CartDrawer";
import ProductQuickView from "@/components/storefront/ProductQuickView";
import Preloader from "@/components/common/Preloader";
import api from "@/lib/api";

interface ProductImage {
  id: string;
  image_url: string;
}

interface Variant {
  id: string;
  variant_type: string;
  variant_value: string;
  extra_price: string | number;
  stock_qty: number;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  stock_quantity: number;
  category_id?: string;
  category_name?: string;
  images: ProductImage[];
  variants: Variant[];
}

interface Category {
  id: string;
  name: string;
}

interface StoreProfile {
  id: string;
  name: string;
  subdomain: string;
  business_category?: string;
  settings?: {
    logo_url?: string;
    hero_images?: string[];
    hero_banner_url?: string;
    hero_heading?: string;
    hero_title?: string;
    hero_description?: string;
    hero_subtitle?: string;
    primary_color?: string;
  };
}

function StorefrontContent({ slug }: { slug: string }) {
  const { totalItems, addItem } = useCart();
  const [store, setStore] = useState<StoreProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Cart & QuickView states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadStorefront();
  }, [slug]);

  const loadStorefront = async () => {
    try {
      setLoading(true);
      setNotFound(false);

      // 1. Fetch Store Profile
      const storeRes = await api.get(`/public/stores/${slug}`);
      setStore(storeRes.data);

      // 2. Fetch Categories & Products
      const [catsRes, prodsRes] = await Promise.all([
        api.get(`/public/stores/${slug}/categories`),
        api.get(`/public/stores/${slug}/products`),
      ]);

      setCategories(catsRes.data);
      setProducts(prodsRes.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByCategory = async (catId: string) => {
    setSelectedCategory(catId);
    try {
      const params = catId ? { category_id: catId } : {};
      const res = await api.get(`/public/stores/${slug}/products`, { params });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to filter products:", err);
    }
  };

  const handleQuickAdd = (product: Product) => {
    const numericPrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;
    const hasVariants = Boolean(product.variants && product.variants.length > 0);
    const defaultVariant = hasVariants && product.variants ? product.variants[0] : null;
    const extraPrice = defaultVariant ? (Number(defaultVariant.extra_price) || 0) : 0;

    addItem({
      product_id: product.id,
      product_name: product.name,
      image_url: product.images?.[0]?.image_url || null,
      base_price: numericPrice,
      price: numericPrice + extraPrice,
      quantity: 1,
      variant_id: defaultVariant?.id,
      variant_info: defaultVariant ? `${defaultVariant.variant_type}: ${defaultVariant.variant_value}` : undefined,
      available_variants: hasVariants && product.variants
        ? product.variants.map((v) => ({
            id: v.id,
            variant_type: String(v.variant_type),
            variant_value: v.variant_value,
            extra_price: Number(v.extra_price) || 0,
          }))
        : undefined,
    });
    setIsCartOpen(true);
  };

  const primaryColor = store?.settings?.primary_color || "#1a5c38";

  if (loading) {
    return <Preloader label="Loading Storefront..." size={44} fullScreen={true} />;
  }

  if (notFound || !store) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8faf9", padding: "2rem", textAlign: "center" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ marginBottom: "1rem" }}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
          Storefront Not Found or Under Setup
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#6b7280", maxWidth: "450px", marginBottom: "1.5rem" }}>
          The store you are looking for may currently be in draft mode or the address is incorrect.
        </p>
        <Link href="/" className="btn btn-primary" style={{ textDecoration: "none" }}>
          Return to Merchant Bazaar
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8faf9", fontFamily: "var(--font-geist-sans), sans-serif" }}>
      {/* ── Store Navigation Bar ────────────────────────────────────────── */}
      <header style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0.85rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {/* Logo & Store Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            {store.settings?.logo_url ? (
              <img
                src={store.settings.logo_url}
                alt={store.name}
                style={{ height: "38px", width: "38px", objectFit: "contain", borderRadius: "8px" }}
                onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
              />
            ) : (
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: primaryColor,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.1rem"
              }}>
                {store.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111827" }}>
              {store.name}
            </span>
          </div>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              backgroundColor: primaryColor,
              color: "#ffffff",
              border: "none",
              padding: "0.55rem 1.15rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.9rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
            }}
          >
            <span>Cart</span>
            <span style={{
              backgroundColor: "rgba(255,255,255,0.25)",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 800,
              padding: "0.15rem 0.45rem",
              borderRadius: "9999px"
            }}>
              {totalItems}
            </span>
          </button>
        </div>
      </header>

      {/* ── Hero Banner ───────────────────────────────────────────────── */}
      {(() => {
        const banner = store.settings?.hero_banner_url || (store.settings?.hero_images && store.settings.hero_images[0]);
        const title = store.settings?.hero_title || store.settings?.hero_heading || `Welcome to ${store.name}`;
        const subtitle = store.settings?.hero_subtitle || store.settings?.hero_description || "Browse our catalog of high-quality products.";

        return (
          <section style={{
            background: banner
              ? `url(${banner}) center/cover no-repeat`
              : `linear-gradient(135deg, ${primaryColor} 0%, #111827 100%)`,
            position: "relative",
            minHeight: "340px",
            display: "flex",
            alignItems: "center",
            padding: "5rem 1.5rem",
            color: "#ffffff"
          }}>
            {banner && (
              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.55)" }} />
            )}
            <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1, width: "100%" }}>
              <h1 style={{ fontSize: "2.35rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>
                {title}
              </h1>
              <p style={{ fontSize: "1.1rem", opacity: 0.9, maxWidth: "620px", margin: 0, lineHeight: 1.5 }}>
                {subtitle}
              </p>
            </div>
          </section>
        );
      })()}

      {/* ── Main Catalog Section ──────────────────────────────────────── */}
      <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
        {/* Category Filter Pills */}
        {categories.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
            <button
              onClick={() => handleFilterByCategory("")}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "9999px",
                border: selectedCategory === "" ? `2px solid ${primaryColor}` : "1px solid #d1d5db",
                backgroundColor: selectedCategory === "" ? primaryColor : "#ffffff",
                color: selectedCategory === "" ? "#ffffff" : "#374151",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              All Products ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleFilterByCategory(c.id)}
                style={{
                  padding: "0.45rem 1rem",
                  borderRadius: "9999px",
                  border: selectedCategory === c.id ? `2px solid ${primaryColor}` : "1px solid #d1d5db",
                  backgroundColor: selectedCategory === c.id ? primaryColor : "#ffffff",
                  color: selectedCategory === c.id ? "#ffffff" : "#374151",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "#ffffff", borderRadius: "14px", border: "1px solid #e5e7eb" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ margin: "0 auto 0.75rem auto" }}>
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
              No products available
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {selectedCategory ? "No products found in this category." : "This store hasn't added products yet."}
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.75rem"
          }}>
            {products.map((prod) => {
              const numericPrice = typeof prod.price === "string" ? parseFloat(prod.price) : prod.price;
              const hasVariants = prod.variants && prod.variants.length > 0;

              return (
                <div
                  key={prod.id}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "14px",
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease"
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => setQuickViewProduct(prod)}
                    style={{
                      height: "220px",
                      backgroundColor: "#f9fafb",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {prod.images?.[0]?.image_url ? (
                      <img
                        src={prod.images[0].image_url}
                        alt={prod.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    )}

                    {prod.category_name && (
                      <span style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        backgroundColor: "rgba(255,255,255,0.9)",
                        color: "#374151",
                        fontSize: "0.725rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.55rem",
                        borderRadius: "6px"
                      }}>
                        {prod.category_name}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3
                      onClick={() => setQuickViewProduct(prod)}
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#111827",
                        margin: "0 0 0.5rem 0",
                        cursor: "pointer",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {prod.name}
                    </h3>

                    {prod.description && (
                      <p style={{
                        fontSize: "0.825rem",
                        color: "#6b7280",
                        margin: "0 0 1rem 0",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>
                        {prod.description}
                      </p>
                    )}

                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#111827" }}>
                        PKR {numericPrice.toLocaleString()}
                      </span>

                      <button
                        onClick={() => handleQuickAdd(prod)}
                        style={{
                          backgroundColor: primaryColor,
                          color: "#ffffff",
                          border: "none",
                          padding: "0.45rem 0.9rem",
                          borderRadius: "8px",
                          fontWeight: 700,
                          fontSize: "0.825rem",
                          cursor: "pointer",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                        }}
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer style={{
        marginTop: "4rem",
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        padding: "2rem 1.5rem",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
          &copy; {new Date().getFullYear()} {store.name} &bull; Powered by{" "}
          <span style={{ color: "#1a5c38", fontWeight: 700 }}>
            Merchant Bazaar
          </span>
        </div>
      </footer>

      {/* Cart Drawer & QuickView Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeSlug={slug}
        primaryColor={primaryColor}
      />

      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        primaryColor={primaryColor}
        onAddToCartSuccess={() => setIsCartOpen(true)}
      />
    </div>
  );
}

function StorefrontWrapper() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  return (
    <CartProvider storeSlug={slug}>
      <StorefrontContent slug={slug} />
    </CartProvider>
  );
}

export default function StorefrontPage() {
  return (
    <React.Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8faf9" }}>
        <div style={{ color: "#1a5c38", fontWeight: 600 }}>Loading storefront...</div>
      </div>
    }>
      <StorefrontWrapper />
    </React.Suspense>
  );
}
