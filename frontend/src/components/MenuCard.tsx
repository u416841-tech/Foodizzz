import { MenuItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Flame } from "lucide-react";
import { useState } from "react";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-charcoal-mid border border-white/5 card-premium transition-all duration-400">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-charcoal-light">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-sienna border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onLoad={() => setImageLoading(false)}
            onError={() => { setImageError(true); setImageLoading(false); }}
            style={{ display: imageLoading ? "none" : "block" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sienna/10 to-gold/10">
            <div className="text-center">
              <span className="text-5xl">🍽️</span>
              <p className="text-xs text-muted-foreground mt-2">{item.name}</p>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge */}
        {item.category && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-xs font-medium text-cream/80">
            {item.category}
          </div>
        )}

        {/* Prep time */}
        {item.preparationTime && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-xs text-cream/80">
            <Clock className="w-3 h-3" />
            {item.preparationTime}m
          </div>
        )}

        {/* Out of stock overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-destructive/80 text-cream text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-serif font-semibold text-cream text-lg leading-tight line-clamp-1 group-hover:text-sienna-light transition-colors">
            {item.name}
          </h3>
          <span className="shrink-0 text-sienna font-bold text-lg">₹{item.price}</span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-5">
          {item.description}
        </p>
        <Button
          className="w-full h-10 bg-sienna/15 hover:bg-sienna text-sienna hover:text-cream border border-sienna/30 hover:border-sienna rounded-xl text-sm font-medium transition-all duration-300 group/btn"
          onClick={() => onAddToCart(item)}
          disabled={!item.available}
        >
          <Plus className="w-4 h-4 mr-2 transition-transform group-hover/btn:rotate-90 duration-300" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
