"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
}

export default function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <div style={{
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "1.35rem",
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.03em" }}>
          {title}
        </span>
        <div style={{ color: "#1a5c38", backgroundColor: "#ecfdf5", padding: "0.4rem", borderRadius: "8px", display: "flex", alignItems: "center" }}>
          {icon}
        </div>
      </div>

      <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
        {value}
      </div>

      {(subtitle || trend) && (
        <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
          {trend && <span style={{ color: "#16a34a", fontWeight: 700 }}>{trend}</span>}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
