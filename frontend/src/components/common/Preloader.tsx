"use client";

import React from "react";

interface PreloaderProps {
  label?: string;
  size?: number;
  fullScreen?: boolean;
}

export default function Preloader({
  label = "Loading Seller Portal...",
  size = 42,
  fullScreen = true,
}: PreloaderProps) {
  const containerStyle: React.CSSProperties = fullScreen
    ? {
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8faf9",
      }
    : {
        padding: "2.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      };

  return (
    <div style={containerStyle} role="status" aria-label={label}>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          border: "3.5px solid rgba(26, 92, 56, 0.15)",
          borderTopColor: "#1a5c38",
          animation: "mbPreloaderSpin 0.75s linear infinite",
        }}
      />

      {/* Label */}
      {label && (
        <p
          style={{
            marginTop: "1.1rem",
            color: "#1a5c38",
            fontSize: "0.925rem",
            fontWeight: 700,
            letterSpacing: "0.015em",
            margin: "1.1rem 0 0 0",
          }}
        >
          {label}
        </p>
      )}

      {/* Embedded Lightweight Keyframe */}
      <style jsx>{`
        @keyframes mbPreloaderSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
