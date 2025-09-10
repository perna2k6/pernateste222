import SocialProof from "@/components/social-proof";
import HeroSection from "@/components/hero-section";
import BooksCarousel from "@/components/books-carousel";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import CountdownTimer from "@/components/countdown-timer";
import PricingSection from "@/components/pricing-section";
import FAQSection from "@/components/faq-section";
import PerformanceDashboard from "@/components/performance-dashboard";
import { useAnalyticsClick } from "@/hooks/use-analytics";
import { EventNames } from "@shared/schema";
import { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Passinhos de Luz</h1>
      <PricingSection />
    </div>
  );
}
