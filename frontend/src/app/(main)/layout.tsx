import React from "react";
import { AuthModalProvider } from "@/context/AuthModalContext";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AuthModalProvider>{children}</AuthModalProvider>;
}
