"use client";

import React, { createContext, useContext, useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

interface AuthModalContextType {
  openSignIn: () => void;
  openSignUp: () => void;
  closeModal: () => void;
  isModalOpen: boolean;
}

const AuthModalContext = createContext<AuthModalContextType>({
  openSignIn: () => {},
  openSignUp: () => {},
  closeModal: () => {},
  isModalOpen: false,
});

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [modalMode, setModalMode] = useState<"signin" | "signup" | null>(null);

  const openSignIn = () => setModalMode("signin");
  const openSignUp = () => setModalMode("signup");
  const closeModal = () => setModalMode(null);

  return (
    <AuthModalContext.Provider
      value={{
        openSignIn,
        openSignUp,
        closeModal,
        isModalOpen: modalMode !== null,
      }}
    >
      {children}
      <AuthModal
        isOpen={modalMode !== null}
        initialMode={modalMode || "signin"}
        onClose={closeModal}
        onSwitchMode={(mode) => setModalMode(mode)}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
