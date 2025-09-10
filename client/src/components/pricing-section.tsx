import { Star, Sparkles, Gift, Crown, Check } from "lucide-react";
import { useAnalyticsConversion } from "@/hooks/use-analytics";
import { EventNames } from "@shared/schema";

export default function PricingSection() {
  const trackConversion = useAnalyticsConversion();

  const handleBasicPackageClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Track conversion with reliable method
    try {
      await trackConversion(EventNames.BASIC_PACKAGE, 'basic-package-button', {
        package: 'basic',
        price: 10,
        url: 'https://pay.cakto.com.br/6citxc2_524924'
      });
    } catch (error) {
      console.warn('Conversion tracking failed:', error);
    }
    
    // Open payment page in new tab
    window.open('https://pay.cakto.com.br/6citxc2_524924', '_blank', 'noopener,noreferrer');
  };

  const handlePremiumPackageClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Track conversion with reliable method
    try {
      await trackConversion(EventNames.PREMIUM_PACKAGE, 'premium-package-button', {
        package: 'premium',
        price: 17,
        url: 'https://pay.cakto.com.br/nfwqwkt_481417'
      });
    } catch (error) {
      console.warn('Conversion tracking failed:', error);
    }
    
    // Open payment page in new tab
    window.open('https://pay.cakto.com.br/nfwqwkt_481417', '_blank', 'noopener,noreferrer');
  };
  return (
    <section id="pacotes" className="py-12 md:py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Escolha sua Oferta Especial
          </h2>
          <p className="text-muted-foreground">
            Livros de atividades cristãs de qualidade profissional para enriquecer seus momentos de fé.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Basic Package */}
          <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="text-2xl text-primary" />
                <h3 className="text-xl font-bold">Pacote Básico</h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold line-through text-red-600">R$ 47,00</span>
                  <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-bold">-79%</span>
                </div>
                <div className="text-4xl font-bold text-primary mb-2">R$ 10,00</div>
                <div className="text-sm text-muted-foreground">Você economiza R$ 37,00</div>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="text-accent mt-1 w-4 h-4" />
                  <span className="text-sm">+600 atividades bíblicas em PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-accent mt-1 w-4 h-4" />
                  <span className="text-sm">12 livros digitais com histórias e atividades ilustradas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-accent mt-1 w-4 h-4" />
                  <span className="text-sm">Acesso vitalício</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-accent mt-1 w-4 h-4" />
                  <span className="text-sm">Suporte via WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-accent mt-1 w-4 h-4" />
                  <span className="text-sm">Garantia de 7 dias</span>
                </li>
              </ul>

              <a 
                href="https://pay.cakto.com.br/6citxc2_524924"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleBasicPackageClick}
                className="block w-full bg-primary text-primary-foreground text-center py-3 px-6 rounded-lg font-bold shadow-lg transform transition hover:scale-105 hover:shadow-xl"
                data-testid="button-basic-package"
              >
                QUERO O PACOTE BÁSICO
              </a>
            </div>
          </div>

          {/* Premium Package */}
          <div className="bg-card rounded-xl shadow-xl border-2 border-primary overflow-hidden relative">
            {/* Popular Badge */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
              ⭐ MAIS VENDIDO
            </div>

            <div className="p-6 pt-12">
              <h3 className="text-xl font-bold mb-4">Pacote Premium</h3>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-medium line-through text-red-600">De R$ 189,00</span>
                  <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-bold">-91%</span>
                </div>
                <div className="text-4xl font-bold text-primary mb-2">R$ 17,00</div>
                <div className="text-sm text-muted-foreground">Você economiza R$ 172,00</div>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Sparkles className="text-primary mt-1 w-4 h-4" />
                  <span className="text-sm font-semibold">TUDO DO PACOTE BÁSICO +</span>
                </li>
                <li className="flex items-start gap-2">
                  <Gift className="text-accent mt-1 w-4 h-4" />
                  <div className="text-sm">
                    <strong>BÔNUS <span className="text-red-600 line-through">1</span>:</strong> Guia de Atividades para Datas Comemorativas Cristãs
                    <div className="text-xs text-muted-foreground">R$29,90</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Gift className="text-accent mt-1 w-4 h-4" />
                  <div className="text-sm">
                    <strong>BÔNUS <span className="text-red-600 line-through">2</span>:</strong> Livro de Colorir Estilo Bobbie Goods
                    <div className="text-xs text-muted-foreground">R$24,90</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Gift className="text-accent mt-1 w-4 h-4" />
                  <div className="text-sm">
                    <strong>BÔNUS <span className="text-red-600 line-through">3</span>:</strong> Jogo de Tabuleiro "Ajudando Noé"
                    <div className="text-xs text-muted-foreground">R$34,90</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Gift className="text-accent mt-1 w-4 h-4" />
                  <div className="text-sm">
                    <strong>BÔNUS <span className="text-red-600 line-through">4</span>:</strong> Calendário Montável Cristão Infantil
                    <div className="text-xs text-muted-foreground">R$19,90</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Crown className="text-primary mt-1 w-4 h-4" />
                  <span className="text-sm">Suporte prioritário</span>
                </li>
              </ul>

              <a 
                href="https://pay.cakto.com.br/nfwqwkt_481417"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePremiumPackageClick}
                className="block w-full bg-accent text-accent-foreground text-center py-3 px-6 rounded-lg font-bold shadow-lg transform transition hover:scale-105 hover:shadow-xl"
                data-testid="button-premium-package"
              >
                QUERO O PACOTE PREMIUM
              </a>

              <div className="text-center mt-3 text-sm text-muted-foreground">
                +500 pessoas já escolheram este pacote
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
