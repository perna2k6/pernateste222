import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "Como recebo os livros?",
    answer: "Você recebe por e-mail o acesso à área de membros onde poderá fazer o download dos PDFs."
  },
  {
    id: 2,
    question: "Posso imprimir quantas vezes quiser?",
    answer: "Sim, os arquivos são seus para sempre"
  },
  {
    id: 3,
    question: "Qual a faixa etária recomendada?",
    answer: "Ideal para crianças de 3 a 10 anos"
  },
  {
    id: 4,
    question: "Posso usar na escola dominical?",
    answer: "Sim, o material é perfeito para aulas e atividades"
  }
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <button 
                onClick={() => toggleItem(faq.id)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-muted transition"
                data-testid={`faq-toggle-${faq.id}`}
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown 
                  className={`transition-transform ${
                    openItems.includes(faq.id) ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {openItems.includes(faq.id) && (
                <div 
                  className="p-4 pt-0 border-t border-border"
                  data-testid={`faq-content-${faq.id}`}
                >
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
