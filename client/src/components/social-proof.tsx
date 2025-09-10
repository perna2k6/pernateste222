import { useState, useEffect } from "react";
import { User } from "lucide-react";

export default function SocialProof() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 13000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="social-proof fixed top-4 left-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-3 md:max-w-sm md:left-auto md:right-4"
      data-testid="social-proof-notification"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <User className="text-primary-foreground text-sm" />
        </div>
        <div className="text-sm">
          <div className="font-semibold text-foreground">Larissa Mendes - Belém</div>
          <div className="text-muted-foreground">Acabou de adquirir: Pacote Premium</div>
          <div className="text-xs text-muted-foreground">12 min atrás</div>
        </div>
      </div>
    </div>
  );
}
