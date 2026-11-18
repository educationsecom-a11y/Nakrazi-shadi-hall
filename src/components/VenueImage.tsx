import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface VenueImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function VenueImage({ src, alt, className = '', fallbackTitle }: VenueImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B3B2E] via-[#06241B] to-[#124B3B] text-[#FAF7F2] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
          viewBox="0 0 200 200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M100 10 L170 50 L170 150 L100 190 L30 150 L30 50 Z"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.5"
          />
          <circle cx="100" cy="100" r="54" fill="none" stroke="#D4AF37" strokeWidth="1" />
        </svg>
        <Sparkles className="w-7 h-7 text-[#D4AF37] mb-2 relative z-10" />
        <span className="font-serif text-base font-semibold text-[#F3DF98] relative z-10 max-w-xs">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}
