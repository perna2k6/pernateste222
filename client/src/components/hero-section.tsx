import { Shield } from "lucide-react";

export default function HeroSection() {
  const scrollToOffers = () => {
    const element = document.getElementById('pacotes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Security Badge */}
      <div className="bg-accent text-accent-foreground text-center py-2 text-sm font-medium">
        <Shield className="inline mr-2 w-4 h-4" />
        COMPRA 100% SEGURA E PROTEGIDA
      </div>

      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center text-white">
            {/* Main Product Image */}
            <div className="mb-8 flex justify-center">
              <img 
                src="https://dainty-pegasus-e6b860.netlify.app/assets/produto-capa-DqWeTLcW.png" 
                alt="Passinhos de Luz - Coleção de Livros Infantis" 
                className="w-64 h-auto md:w-80 drop-shadow-2xl"
                data-testid="hero-product-image"
              />
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              12 Livros de Atividades Cristãs
            </h1>
            <p className="text-lg md:text-xl mb-2 opacity-90">
              Transforme momentos em família com histórias bíblicas ilustradas
            </p>
            <p className="text-base md:text-lg mb-8 opacity-80 italic">
              "Momentos especiais para ensinar e encantar"
            </p>

            <button 
              onClick={scrollToOffers}
              className="inline-block bg-accent text-accent-foreground px-8 py-4 rounded-lg font-bold text-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl"
              data-testid="button-hero-offers"
            >
              QUERO VER AS OFERTAS
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
