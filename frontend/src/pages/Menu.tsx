import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/ui/navbar";
import { MenuCard } from "@/components/MenuCard";
import { MenuItem } from "@/types";
import { Search, MapPin, Navigation, X, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Hard-coded fallback dishes shown while backend loads ── */
const FALLBACK_DISHES = [
  { label: "Butter Chicken",  emoji: "🍗", price: 280, cat: "North Indian" },
  { label: "Hyderabadi Biryani", emoji: "🍚", price: 320, cat: "Biryani" },
  { label: "Paneer Tikka",    emoji: "🧀", price: 240, cat: "Starters" },
  { label: "Masala Dosa",     emoji: "🫓", price: 120, cat: "South Indian" },
  { label: "Dal Makhani",     emoji: "🫘", price: 180, cat: "North Indian" },
  { label: "Tandoori Roti",   emoji: "🫓", price: 40,  cat: "Breads" },
  { label: "Chole Bhature",   emoji: "🍽️", price: 160, cat: "Street Food" },
  { label: "Gulab Jamun",     emoji: "🍮", price: 80,  cat: "Desserts" },
];

/* ─── Skeleton card ──────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/4 border border-white/5 overflow-hidden animate-pulse">
      <div className="h-48 bg-white/6" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/6 rounded-full w-3/4" />
        <div className="h-3 bg-white/6 rounded-full w-full" />
        <div className="h-3 bg-white/6 rounded-full w-2/3" />
        <div className="h-9 bg-white/6 rounded-xl mt-2" />
      </div>
    </div>
  );
}

/* ─── Fallback bento card (shown when backend is offline) ── */
function FallbackCard({ dish }: { dish: typeof FALLBACK_DISHES[0] }) {
  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden group hover:border-sienna/40 transition-all duration-300 hover:-translate-y-1"
      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)" }}>
      {/* Emoji placeholder image area */}
      <div className="h-48 flex items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(18 72% 52% / 0.12), hsl(220 13% 15% / 0.8))" }}>
        <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{dish.emoji}</span>
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sienna/20 text-sienna border border-sienna/25">
            {dish.cat}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-cream text-base mb-1">{dish.label}</h3>
        <p className="text-muted-foreground text-xs mb-3">Authentic recipe, freshly prepared</p>
        <div className="flex items-center justify-between">
          <span className="text-sienna font-bold text-lg">₹{dish.price}</span>
          <button className="px-4 py-1.5 rounded-xl bg-sienna/15 border border-sienna/30 text-sienna text-xs font-medium hover:bg-sienna hover:text-cream transition-all duration-200">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Menu Page ─────────────────────────────────────── */
export default function Menu() {
  const { toast } = useToast();
  const { addToCart, cartItems } = useCart();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Location state
  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendDown, setBackendDown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Restore saved address
  useEffect(() => {
    const saved = sessionStorage.getItem("deliveryAddress");
    if (saved) { setAddress(saved); setAddressConfirmed(true); }
  }, []);

  // Fetch dishes — always runs, never blocks the UI
  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/dishes`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        setMenuItems(data.map((d: any) => ({
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
        })));
        setBackendDown(false);
        setLoading(false);
      })
      .catch(() => { setBackendDown(true); setLoading(false); });
  }, [BACKEND_URL]);

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
          const label = data.display_name?.split(",").slice(0, 3).join(", ") ||
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

  const handleConfirmAddress = () => {
    if (!address.trim()) return;
    sessionStorage.setItem("deliveryAddress", address.trim());
    setAddressConfirmed(true);
  };

  const handleResetAddress = () => {
    sessionStorage.removeItem("deliveryAddress");
    setAddressConfirmed(false);
  };

  const categories = useMemo(() => {
    const unique = Array.from(new Set(menuItems.map((i) => i.category).filter(Boolean)));
    return ["All", ...unique];
  }, [menuItems]);

  const filtered = menuItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchCat = selectedCategory === "All" || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartItems.length} />

      {/* ── HERO — always visible, never blank ─────────────── */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        {/* Static gradient background — never fails */}
        <div className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(135deg, hsl(220 13% 7%) 0%, hsl(220 13% 11%) 50%, hsl(18 72% 52% / 0.08) 100%)" }} />
        {/* Ambient orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sienna/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-sienna/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 container px-4 py-12 grid lg:grid-cols-2 gap-10 items-start">

          {/* Left — heading + location card */}
          <div>
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-8 h-px bg-sienna" />
              <span className="text-sienna text-xs font-medium tracking-[0.2em] uppercase">Foodizzz Menu</span>
              <span className="w-8 h-px bg-sienna" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream leading-tight mb-3">
              Explore Our Full Menu:<br />
              <span className="italic text-gradient">Taste the Best</span> of Foodizzz
            </h1>
            <p className="text-muted-foreground text-base mb-8">
              Authentic Indian flavours, crafted fresh — delivered to your door.
            </p>

            {/* ── Location card — AnimatePresence transitions between states ── */}
            <div className="glass-strong rounded-3xl p-6 shadow-2xl shadow-black/50 border border-white/8 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {addressConfirmed ? (
                  /* Confirmed state */
                  <motion.div
                    key="confirmed"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-sienna/20 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-sienna" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">Delivering to</p>
                        <p className="text-cream text-sm font-medium truncate">{address}</p>
                      </div>
                    </div>
                    <button onClick={handleResetAddress}
                      className="shrink-0 px-3 py-1.5 rounded-xl border border-white/10 text-muted-foreground hover:text-cream hover:border-white/20 text-xs transition-colors">
                      Change
                    </button>
                  </motion.div>
                ) : (
                  /* Input state */
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="text-cream/80 text-sm font-medium mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-sienna" />
                      Set your delivery location
                    </p>
                    <div className="relative mb-3">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleConfirmAddress()}
                        placeholder="Enter your delivery address..."
                        className="w-full h-12 pl-11 pr-10 rounded-2xl bg-charcoal-mid border border-white/15 text-white caret-white placeholder:text-white/35 focus:outline-none focus:border-sienna/60 transition-all text-sm"
                      />
                      <AnimatePresence>
                        {address && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.18 }}
                            onClick={() => setAddress("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-px bg-white/8" />
                      <span className="text-cream/30 text-xs tracking-widest uppercase">or</span>
                      <div className="flex-1 h-px bg-white/8" />
                    </div>
                    <button onClick={handleGPS} disabled={locating}
                      className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl border border-sienna/35 text-sienna hover:bg-sienna/10 hover:border-sienna/60 transition-all text-sm font-medium mb-3 disabled:opacity-50">
                      {locating
                        ? <><div className="w-4 h-4 border-2 border-sienna border-t-transparent rounded-full animate-spin" />Detecting...</>
                        : <><Navigation className="w-4 h-4" />Use Current Location</>}
                    </button>
                    <motion.button
                      onClick={handleConfirmAddress}
                      disabled={!address.trim()}
                      whileTap={{ scale: 0.97 }}
                      className="w-full h-12 rounded-2xl bg-sienna hover:bg-sienna-light disabled:opacity-35 disabled:cursor-not-allowed text-cream font-semibold text-sm transition-all shadow-lg shadow-sienna/25"
                    >
                      Confirm Location →
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right — live stats + category quick-links */}
          <div className="hidden lg:flex flex-col gap-4">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: loading ? "—" : `${menuItems.length}+`, label: "Dishes" },
                { value: "4.9★", label: "Rating" },
                { value: "20 min", label: "Avg. Ready" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center border border-white/6">
                  <div className="font-serif text-2xl font-bold text-sienna">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Category quick-links — always visible */}
            <div className="glass rounded-2xl p-5 border border-white/6">
              <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase mb-3 flex items-center gap-2">
                <Utensils className="w-3.5 h-3.5 text-sienna" /> Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {(loading || backendDown
                  ? ["North Indian", "Biryani", "South Indian", "Street Food", "Starters", "Breads", "Desserts"]
                  : categories.filter(c => c !== "All").slice(0, 10)
                ).map((cat) => (
                  <button key={cat}
                    onClick={() => { setSelectedCategory(cat); document.getElementById("menu-grid")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-muted-foreground hover:border-sienna/40 hover:text-sienna hover:bg-sienna/8 transition-all duration-200">
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search box */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 h-11 rounded-2xl bg-gray-800 border border-white/15 text-gray-100 text-sm placeholder:text-gray-500 focus:outline-none focus:border-sienna/60 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10">
            <path d="M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z" fill="hsl(220 13% 9%)" />
          </svg>
        </div>
      </section>

      {/* ── MENU GRID — always rendered, never hidden ───────── */}
      <section id="menu-grid" className="bg-background">
        {/* Mobile search + filters */}
        <div className="lg:hidden sticky top-[72px] z-40 bg-background/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 h-9 rounded-full bg-gray-800 border border-white/15 text-gray-100 text-sm placeholder:text-gray-500 focus:outline-none focus:border-sienna/60 transition-colors"
            />
          </div>
          {addressConfirmed && (
            <button onClick={handleResetAddress}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sienna/10 border border-sienna/25 text-sienna text-xs font-medium">
              <MapPin className="w-3 h-3" />
              <span className="max-w-[200px] truncate">{address}</span>
              <X className="w-3 h-3 opacity-60" />
            </button>
          )}
        </div>

        {/* Category pills */}
        {!loading && !backendDown && categories.length > 1 && (
          <div className="sticky top-[72px] lg:top-[72px] z-30 bg-background/95 backdrop-blur-xl border-b border-white/5">
            <div className="container px-4 py-2.5 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-sienna text-cream border-sienna shadow-md shadow-sienna/20"
                        : "bg-transparent text-muted-foreground border-white/10 hover:border-sienna/30 hover:text-cream"
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="container px-4 py-10">
          <div className="mb-8">
            <span className="text-sienna text-xs font-medium tracking-[0.2em] uppercase">
              {backendDown ? "Featured Dishes" : selectedCategory === "All" ? "All Dishes" : selectedCategory}
            </span>
            <h2 className="font-serif text-3xl font-bold text-cream mt-1">
              {loading ? "Loading menu..." : backendDown ? "Our Specialities" : `${filtered.length} dish${filtered.length !== 1 ? "es" : ""} available`}
            </h2>
          </div>

          {/* Skeleton — while loading */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Fallback bento grid — when backend is down */}
          {!loading && backendDown && (
            <>
              <div className="mb-6 px-4 py-3 rounded-2xl bg-sienna/8 border border-sienna/20 text-sienna text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sienna animate-pulse" />
                Backend is starting up — showing sample menu. Refresh in a moment.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {FALLBACK_DISHES.map((dish) => <FallbackCard key={dish.label} dish={dish} />)}
              </div>
            </>
          )}

          {/* Real menu grid — AnimatePresence for staggered item entry */}
          {!loading && !backendDown && filtered.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.055 } } }}
            >
              <AnimatePresence>
                {filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                    }}
                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MenuCard
                      item={item}
                      onAddToCart={(item) => {
                        addToCart(item);
                        toast({ title: "Added to cart", description: `${item.name} added.` });
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty state */}
          {!loading && !backendDown && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">No dishes match your search.</p>
              <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                className="px-6 py-2 rounded-full border border-sienna/30 text-sienna text-sm hover:bg-sienna/10 transition-colors">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
