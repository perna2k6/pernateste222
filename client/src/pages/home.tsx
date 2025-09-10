import { useEffect } from "react";
import SocialProof from "@/components/social-proof";
import HeroSection from "@/components/hero-section";
import BooksCarousel from "@/components/books-carousel";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import CountdownTimer from "@/components/countdown-timer";
import PricingSection from "@/components/pricing-section";
import FAQSection from "@/components/faq-section";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();

  const scrollToOffers = () => {
    const element = document.getElementById('pacotes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <SocialProof />
      <HeroSection />
      
      {/* Why Choose Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-foreground">
            Por que escolher o Passinhos de Luz?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl mb-4">👥</div>
              <h3 className="font-bold text-lg mb-2">Células e Grupos</h3>
              <p className="text-muted-foreground text-sm">Perfeito para atividades com crianças em grupos de comunhão</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl mb-4">⛪</div>
              <h3 className="font-bold text-lg mb-2">Escola Dominical</h3>
              <p className="text-muted-foreground text-sm">Material ilustrado ideal para aulas bíblicas divertidas</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl mb-4">❤️</div>
              <h3 className="font-bold text-lg mb-2">Devocional Familiar</h3>
              <p className="text-muted-foreground text-sm">Fortaleça a fé em família com momentos criativos</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl mb-4">🎨</div>
              <h3 className="font-bold text-lg mb-2">Uso Pedagógico</h3>
              <p className="text-muted-foreground text-sm">Ajuda no desenvolvimento da coordenação motora</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <button 
              onClick={scrollToOffers}
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold shadow-lg transform transition hover:scale-105"
              data-testid="button-why-choose-offers"
            >
              QUERO VER AS OFERTAS
            </button>
          </div>
        </div>
      </section>

      <BooksCarousel />
      <TestimonialsCarousel />
      <CountdownTimer />
      <PricingSection />
      <FAQSection />

      {/* Sticky CTA for Mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-40">
          <button 
            onClick={scrollToOffers}
            className="block w-full bg-accent text-accent-foreground text-center py-3 px-6 rounded-lg font-bold shadow-lg"
            data-testid="button-sticky-offers"
          >
            VER OFERTAS ESPECIAIS
          </button>
        </div>
      )}
    </div>
  );
}
