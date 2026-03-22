interface BrandLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizes = {
  xs: { img: "w-6 h-6",  text: "text-base" },
  sm: { img: "w-8 h-8",  text: "text-lg"   },
  md: { img: "w-10 h-10", text: "text-xl"  },
  lg: { img: "w-14 h-14", text: "text-3xl" },
  xl: { img: "w-20 h-20", text: "text-5xl" },
};

export function BrandLogo({ size = "md", showText = true, className = "" }: BrandLogoProps) {
  const s = sizes[size];
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.svg"
        alt="Foodizzz logo"
        className={`${s.img} rounded-xl shadow-lg shadow-sienna/20 flex-shrink-0`}
        draggable={false}
      />
      {showText && (
        <span className={`font-serif font-bold text-cream tracking-wide leading-none ${s.text}`}>
          Foodizzz
        </span>
      )}
    </span>
  );
}
