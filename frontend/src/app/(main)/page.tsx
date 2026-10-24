import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="landing-page-wrapper">
      <Navbar />
      <main>
        <HeroSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
