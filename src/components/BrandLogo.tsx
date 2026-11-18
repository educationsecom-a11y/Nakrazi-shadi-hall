interface BrandLogoProps {
  light?: boolean;
  className?: string;
}

export function BrandLogo({ light = false, className = 'w-10 h-10' }: BrandLogoProps) {
  const strokeMain = light ? '#F3DF98' : '#0B3B2E';
  const strokeAccent = '#D4AF37';
  const fillBg = light ? '#06241B' : '#0B3B2E';

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" fill={fillBg} stroke={strokeAccent} strokeWidth="1.5" />
      <path
        d="M24 6L36.7 11.3L42 24L36.7 36.7L24 42L11.3 36.7L6 24L11.3 11.3L24 6Z"
        stroke={strokeAccent}
        strokeWidth="1.25"
        strokeOpacity="0.75"
      />
      <path
        d="M16 32V16L24 27L32 16V32"
        stroke="#FAF7F2"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 11L26.2 14.5L24 18L21.8 14.5L24 11Z"
        fill={strokeAccent}
        stroke={strokeMain}
        strokeWidth="0.5"
      />
    </svg>
  );
}
