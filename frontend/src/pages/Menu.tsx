import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/ui/navbar";
import { MenuCard } from "@/components/MenuCard";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types";
import { Search, MapPin, Navigation, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";

/* ─── Location Hero ──────────────────────────────────────── */
function LocationHero({ onConfirm }: { onConfirm: (address: string) => void }) {
  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          const label =
            data.display_name?.split(",").slice(0, 3).join(", ") ||
            `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
          setAddress(label);
        } catch {
          setAddress(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        }
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const handleConfirm = () => {
    if (address.trim()) onConfirm(address.trim());
  };

  // Food images for the collage
  const foodImages = [
    { src: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80&fit=crop", label: "Butter Chicken" },
    { src: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80&fit=crop", label: "Biryani" },
    { src: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80&fit=crop", label: "Paneer Tikka" },
    { src: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&q=80&fit=crop", label: "Masala Dosa" },
    { src: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80&fit=crop", label: "Dal Makhani" },
    { src: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&q=80&fit=crop", label: "Tandoori" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image collage — 3-col mosaic */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-0.5">
        {foodImages.map((img, i) => (
          <div key={i} className="relative overflow-hidden">
            <img
              src={img.src}
              alt={img.label}
              className="w-full h-full object-cover scale-110"
              style={{ filter: "brightness(0.45) saturate(1.2)" }}
            />
          </div>
        ))}
      </div>

      {/* Unified dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
      {/* Sienna ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sienna/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Two-column layout */}
      <div className="relative z-10 container py-24 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left — text + location module */}
        <div className="w-full max-w-xl">
          <div className="inline-flex items-center gap-2 mb-6 animate-fade-up">
            <span className="w-8 h-px bg-sienna" />
            <span className="text-sienna text-sm font-medium tracking-[0.2em] uppercase">Foodizzz</span>
            <span className="w-8 h-px bg-sienna" />
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight mb-4 animate-fade-up-delay-1">
            Explore Our Full Menu:<br />
            <span className="italic text-gradient">Taste the Best</span><br />
            of Foodizzz
          </h1>

          <p className="text-cream/70 text-base mb-8 animate-fade-up-delay-2">
            Authentic Indian flavours, crafted fresh — delivered to your door.
          </p>

          {/* Glassmorphism location module */}
          <div className="glass-strong rounded-3xl p-6 animate-fade-up-delay-3 shadow-2xl shadow-black/40">
            <p className="text-cream/80 text-sm font-medium mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sienna" />
              Set your delivery location to start ordering
            </p>

            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                placeholder="Enter your delivery address..."
                className="w-full h-12 pl-11 pr-10 rounded-2xl bg-white/8 border border-white/15 text-cream placeholder:text-cream/35 focus:outline-none focus:border-sienna/60 focus:bg-white/12 transition-all duration-300 text-sm"
              />
              {address && (
                <button onClick={() => setAddress("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-cream/40 text-xs font-semibold tracking-widest uppercase">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              onClick={handleGPS}
              disabled={locating}
              className="w-full flex items-center justify-center gap-3 h-11 rounded-2xl border border-sienna/40 text-sienna hover:bg-sienna/10 hover:border-sienna/70 transition-all duration-300 text-sm font-medium mb-4 disabled:opacity-60"
            >
              {locating ? (
                <><div className="w-4 h-4 border-2 border-sienna border-t-transparent rounded-full animate-spin" />Detecting location...</>
              ) : (
                <><Navigation className="w-4 h-4" />Use Current Location</>
              )}
            </button>

            <button
              onClick={handleConfirm}
              disabled={!address.trim()}
              className="w-full h-12 rounded-2xl bg-sienna hover:bg-sienna-light disabled:opacity-40 disabled:cursor-not-allowed text-cream font-semibold text-base transition-all duration-300 shadow-lg shadow-sienna/30 hover:shadow-sienna/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              Browse Menu →
            </button>
          </div>
        </div>

        {/* Right — featured dish cards */}
        <div className="hidden lg:grid grid-cols-2 gap-3 animate-fade-up-delay-2">
          {foodImages.slice(0, 4).map((img, i) => (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
              style={{ height: i % 2 === 0 ? "200px" : "160px", marginTop: i % 2 !== 0 ? "40px" : "0" }}
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-cream font-semibold text-sm drop-shadow">{img.label}</span>
              </div>
              {/* Sienna accent border on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-sienna/0 group-hover:border-sienna/50 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Liquid bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="hsl(220 13% 9%)" />
        </svg>
      </div>
    </section>
  );
}

/* ─── Menu Grid ──────────────────────────────────────────── */
function MenuGrid({
  address,
  onReset,
}: {
  address: string;
  onReset: () => void;
}) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { addToCart, cartItems } = useCart();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/dishes`)
      .then((r) => { if (!r.ok) throw new Error("Failed to fetch"); return r.json(); })
      .then((data) => {
        setMenuItems(
          data.map((d: any) => ({
            id: d._id || d.id,
            name: d.name,
            description: d.description || "",
            price: d.price,
            image: d.imageUrl
              ? d.imageUrl.startsWith("http") ? d.imageUrl : `${BACKEND_URL}${d.imageUrl}`
              : "",
            available: d.available,
            preparationTime: d.preparationTime || 15,
            category: d.category || "Specials",
          }))
        );
        setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [BACKEND_URL]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(menuItems.map((i) => i.category).filter(Boolean)));
    return ["All", ...unique];
  }, [menuItems]);

  const filtered = menuItems.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchCat = selectedCategory === "All" || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky sub-header */}
      <div className="sticky top-[72px] z-40 bg-background/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20">
        <div className="container px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Location pill */}
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-sienna/10 border border-sienna/25 text-sienna text-sm font-medium hover:bg-sienna/20 transition-colors shrink-0"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="max-w-[180px] truncate">{address}</span>
            <X className="w-3 h-3 opacity-60" />
          </button>

          {/* Search */}
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 h-9 rounded-full bg-charcoal-mid border border-white/8 text-cream text-sm placeholder:text-muted-foreground focus:outline-none focus:border-sienna/40 transition-colors"
            />
          </div>
        </div>

        {/* Category pills */}
        {categories.length > 1 && (
          <div className="container px-4 pb-3 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-sienna text-cream border-sienna shadow-md shadow-sienna/20"
                      : "bg-transparent text-muted-foreground border-white/10 hover:border-sienna/30 hover:text-cream"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="container px-4 py-10">
        {/* Section label */}
        <div className="mb-8 animate-fade-up">
          <span className="text-sienna text-xs font-medium tracking-[0.2em] uppercase">
            {selectedCategory === "All" ? "All Dishes" : selectedCategory}
          </span>
          <h2 className="font-serif text-3xl font-bold text-cream mt-1">
            {loading ? "Loading..." : `${filtered.length} dish${filtered.length !== 1 ? "es" : ""} available`}
          </h2>
        </div>

        {loading ? (
          /* Skeleton grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="rounded-2xl bg-charcoal-mid border border-white/5 overflow-hidden animate-pulse">
                <div className="h-52 bg-charcoal-light" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-charcoal-light rounded-full w-3/4" />
                  <div className="h-3 bg-charcoal-light rounded-full w-full" />
                  <div className="h-3 bg-charcoal-light rounded-full w-2/3" />
                  <div className="h-9 bg-charcoal-light rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive text-lg">{error}</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item, i) => (
              <div
                key={item.id || (item as any)._id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s`, opacity: 0 }}
              >
                <MenuCard
                  item={item}
                  onAddToCart={(item) => {
                    addToCart(item);
                    toast({ title: "Added to cart", description: `${item.name} added.` });
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">No dishes found.</p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
              className="px-6 py-2 rounded-full border border-sienna/30 text-sienna text-sm hover:bg-sienna/10 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function Menu() {
  const { cartItems } = useCart();
  const [address, setAddress] = useState<string | null>(null);
  const [dissolving, setDissolving] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  // Persist address in sessionStorage so refresh keeps state
  useEffect(() => {
    const saved = sessionStorage.getItem("deliveryAddress");
    if (saved) { setAddress(saved); setShowGrid(true); }
  }, []);

  const handleConfirm = (addr: string) => {
    setDissolving(true);
    sessionStorage.setItem("deliveryAddress", addr);
    setTimeout(() => {
      setAddress(addr);
      setShowGrid(true);
      setDissolving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  const handleReset = () => {
    sessionStorage.removeItem("deliveryAddress");
    setShowGrid(false);
    setAddress(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartItems.length} />

      {/* Hero — dissolves out */}
      <div
        className="transition-all duration-600 ease-in-out"
        style={{
          opacity: dissolving ? 0 : showGrid ? 0 : 1,
          transform: dissolving || showGrid ? "scale(1.02)" : "scale(1)",
          pointerEvents: showGrid ? "none" : "auto",
          position: showGrid ? "absolute" : "relative",
          width: "100%",
          transitionDuration: "600ms",
        }}
      >
        <LocationHero onConfirm={handleConfirm} />
      </div>

      {/* Menu grid — fades in */}
      {showGrid && address && (
        <div
          className="animate-fade-in"
          style={{ paddingTop: "72px" }}
        >
          <MenuGrid address={address} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
