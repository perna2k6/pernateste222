import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LazyImage from "./lazy-image";

const books = [
  {
    id: 1,
    title: "Jogo da Memória Cristão",
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/livro-01-D3WBcZIQ.png"
  },
  {
    id: 2,
    title: "Colorindo com Propósito",
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/livro-02-Cu86Hp3C.jpg"
  },
  {
    id: 3,
    title: "Complete os Nomes dos Animais",
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/livro-03-fzuubtX-.jpg"
  },
  {
    id: 4,
    title: "Aprendendo a Orar",
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/livro-04-Dedrdk5M.jpg"
  },
  {
    id: 5,
    title: "O Amor de Deus",
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/livro-05-Ceh1L1EO.jpg"
  },
  {
    id: 6,
    title: "Antigo Testamento",
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/livro-06-Bsb3sXhR.jpg"
  },
  {
    id: 7,
    title: "Passatempos Bíblicos",
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/livro-07-MWWVyCIn.jpg"
  },
  {
    id: 8,
    title: "Alfabeto Bíblico para Colorir",
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/livro-08-ByqzuicK.jpg"
  },
  {
    id: 9,
    title: "Aventuras Bíblicas",
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/livro-09-DbqfQBfR.png"
  },
  {
    id: 10,
    title: "Atividades Bíblicas ABC",
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/livro-10-k2eFABif.png"
  },
  {
    id: 11,
    title: "Andando com Jesus",
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/livro-11-BnAUppQF.png"
  },
  {
    id: 12,
    title: "Alfabeto Bíblico Infantil",
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/livro-12-lvC17W7-.jpg"
  }
];

export default function BooksCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToOffers = () => {
    const element = document.getElementById('pacotes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Conheça Nossa Coleção
          </h2>
          <p className="text-muted-foreground">
            Uma coleção completa de histórias bíblicas ilustradas, perfeitas para colorir e aprender.
          </p>
        </div>

        {/* Books Carousel */}
        <div className="relative">
          <div 
            ref={carouselRef}
            className="carousel-container flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory"
            data-testid="books-carousel"
          >
            {books.map((book) => (
              <div key={book.id} className="flex-shrink-0 w-48 md:w-56 snap-center">
                <div className="bg-card rounded-lg shadow-lg overflow-hidden">
                  <LazyImage
                    src={book.image}
                    alt={book.title}
                    className="w-full h-48 md:h-56 object-cover"
                    data-testid={`book-image-${book.id}`}
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm md:text-base text-center">
                      {book.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation Buttons */}
          <button 
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-card border border-border rounded-full p-2 shadow-lg hover:shadow-xl transition"
            data-testid="button-carousel-prev"
          >
            <ChevronLeft className="text-foreground" />
          </button>
          <button 
            onClick={scrollRight}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-card border border-border rounded-full p-2 shadow-lg hover:shadow-xl transition"
            data-testid="button-carousel-next"
          >
            <ChevronRight className="text-foreground" />
          </button>
        </div>

        {/* Collection Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-primary">📚</div>
            <div className="text-sm md:text-base font-semibold">12 Livros</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-primary">⭐</div>
            <div className="text-sm md:text-base font-semibold">Alta Qualidade</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-primary">👨‍👩‍👧‍👦</div>
            <div className="text-sm md:text-base font-semibold">Todas Idades</div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button 
            onClick={scrollToOffers}
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold shadow-lg transform transition hover:scale-105"
            data-testid="button-collection-offers"
          >
            QUERO VER AS OFERTAS
          </button>
        </div>
      </div>
    </section>
  );
}
