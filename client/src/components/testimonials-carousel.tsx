import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import LazyImage from "./lazy-image";

const testimonials = [
  {
    id: 1,
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/depoimento-2-COHgGaiF.png"
  },
  {
    id: 2,
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/depoimento-3-695YjbwL.png"
  },
  {
    id: 3,
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/depoimento-4-B6LjLmlK.png"
  },
  {
    id: 4,
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/depoimento-5-De7TBpND.png"
  },
  {
    id: 5,
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/depoimento-6-C66oT8y5.png"
  },
  {
    id: 6,
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/depoimento-7-CSKDX6F_.png"
  },
  {
    id: 7,
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/depoimento-8-CmNOc4Cz.png"
  },
  {
    id: 8,
    image: "https://dainty-pegasus-e6b860.netlify.app/assets/depoimento-9-FRbHgqQe.png"
  }
];

export default function TestimonialsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            O que dizem os nossos clientes
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex text-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="font-bold">4.9/5</span>
            <span className="text-muted-foreground">- 377 avaliações</span>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div 
            ref={carouselRef}
            className="carousel-container flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory"
            data-testid="testimonials-carousel"
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex-shrink-0 w-48 md:w-56 snap-center">
                <LazyImage
                  src={testimonial.image}
                  alt="Depoimento de cliente"
                  className="w-full h-auto rounded-lg shadow-lg"
                  data-testid={`testimonial-${testimonial.id}`}
                />
              </div>
            ))}
          </div>

          {/* Testimonials Navigation */}
          <button 
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-card border border-border rounded-full p-2 shadow-lg hover:shadow-xl transition"
            data-testid="button-testimonials-prev"
          >
            <ChevronLeft className="text-foreground" />
          </button>
          <button 
            onClick={scrollRight}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-card border border-border rounded-full p-2 shadow-lg hover:shadow-xl transition"
            data-testid="button-testimonials-next"
          >
            <ChevronRight className="text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
}
