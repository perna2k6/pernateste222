import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  'data-testid'?: string;
  width?: number;
  height?: number;
  priority?: boolean; // For above-the-fold images
  sizes?: string; // Responsive sizes attribute
}

export default function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzllYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcnJlZ2FuZG8uLi48L3RleHQ+Cjwvc3ZnPgo=',
  width,
  height,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  'data-testid': dataTestId
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate WebP URL if supported
  const generateImageUrl = (originalSrc: string) => {
    // Check if browser supports WebP
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('webp') > -1;
    };

    // If it's an external URL and WebP is supported, try to get WebP version
    if (supportsWebP() && originalSrc.includes('netlify.app')) {
      // For external images, we can't always convert to WebP, but we can add format parameters if supported
      try {
        const url = new URL(originalSrc);
        url.searchParams.set('f', 'webp');
        url.searchParams.set('q', '85'); // Quality parameter
        return url.toString();
      } catch (e) {
        return originalSrc;
      }
    }
    return originalSrc;
  };

  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px' // Start loading 100px before for better UX
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setImgError(true);
    setIsLoaded(true); // Still consider it "loaded" to stop showing placeholder
  };

  const optimizedSrc = generateImageUrl(src);

  return (
    <div className={`relative ${className}`} ref={imgRef}>
      {/* Placeholder */}
      {!isLoaded && !imgError && (
        <img
          src={placeholder}
          alt="Carregando..."
          className={className}
          style={{ filter: 'blur(2px)' }}
          loading="lazy"
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <picture>
          {/* WebP source for supported browsers */}
          <source srcSet={optimizedSrc} type="image/webp" />
          <img
            src={src}
            alt={alt}
            className={`${className} ${!isLoaded ? 'absolute inset-0 opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width={width}
            height={height}
            sizes={sizes}
            data-testid={dataTestId}
          />
        </picture>
      )}

      {/* Error fallback */}
      {imgError && (
        <div className={`${className} flex items-center justify-center bg-muted text-muted-foreground`}>
          <span className="text-sm">Imagem indisponível</span>
        </div>
      )}
    </div>
  );
}