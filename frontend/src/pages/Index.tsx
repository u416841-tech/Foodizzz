import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ArrowRight, ChefHat, Clock, Star, Truck, Award, Users, Flame, Leaf } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MenuItem } from "@/types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  motion,
  useInView,
  AnimatePresence,
  type Variants,
} from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

/* ─── Easing presets ────────────────────────────────────── */
const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Motion variants ───────────────────────────────────── */
const heroPlatVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut, delay: 0.3 },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.10, delayChildren: 0.05 },
  },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeOut },
  },
};

/* ─── Word-by-word masked text reveal ───────────────────── */
const heroContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
};

const cubicBezierWord: [number, number, number, number] = [0.22, 1, 0.36, 1];

const wordReveal: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.65, ease: cubicBezierWord },
  },
};

/* Splits a text string into animated word spans with overflow-hidden masking */
function AnimatedHeadline({
  lines,
  className,
}: {
  lines: Array<{ text: string; className?: string }[]>;
  className?: string;
}) {
  return (
    <motion.h1
      className={className}
      variants={heroContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {lines.map((lineWords, li) => (
        <span key={li} className="block">
          {lineWords.map((segment, si) => (
            <span
              key={si}
              className={`inline-block overflow-hidden align-bottom leading-[1.15] mr-[0.22em] last:mr-0 ${segment.className ?? ""}`}
            >
              <motion.span
                className="inline-block"
                variants={wordReveal}
              >
                {segment.text}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}

/* ─── Spotlight-tracking glass card wrapper ─────────────── */
function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [spotlight, setSpotlight] = useState({ x: -999, y: -999, active: false });
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
  }

  function handleMouseLeave() {
    setSpotlight((s) => ({ ...s, active: false }));
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{ isolation: "isolate" }}
    >
      {/* The spotlight radial gradient layer — sits behind content */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl z-0"
        animate={{
          background: spotlight.active
            ? `radial-gradient(260px circle at ${spotlight.x}px ${spotlight.y}px, rgba(196,98,58,0.13) 0%, transparent 70%)`
            : "radial-gradient(260px circle at -999px -999px, transparent 0%, transparent 100%)",
          opacity: spotlight.active ? 1 : 0,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />
      {/* Content sits on top */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ─── Floating 3D Hero Plate ─────────────────────────────── */
function HeroPlate({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const tiltX = (mouseY - 0.5) * -18;
  const tiltY = (mouseX - 0.5) * 18;
  return (
    <div
      className="relative w-full max-w-[520px] mx-auto min-h-[380px] flex items-center justify-center"
      style={{
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: "transform 0.12s ease-out",
      }}
    >
      <div className="absolute inset-0 rounded-full bg-sienna/20 blur-3xl scale-75 animate-pulse-glow" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/60 blur-2xl rounded-full" />
      <img
        src="/hero1.png"
        alt="Signature dish"
        className="relative z-10 w-full h-auto drop-shadow-2xl animate-float"
        style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))" }}
        onError={(e) => {
          const t = e.currentTarget;
          t.style.display = "none";
          const fallback = t.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div
        className="relative z-10 w-full h-80 rounded-3xl items-center justify-center flex-col gap-4"
        style={{ display: "none", background: "linear-gradient(135deg, hsl(18 72% 52% / 0.15), hsl(220 13% 15%))" }}
      >
        <span className="text-8xl">🍛</span>
        <p className="font-serif text-cream text-xl font-semibold">Taste the Art of Indian Food</p>
      </div>
      <div className="glass absolute top-8 -left-4 z-20 px-4 py-2 rounded-2xl flex items-center gap-2 animate-fade-up-delay-3">
        <Clock className="w-4 h-4 text-sienna" />
        <span className="text-sm font-medium text-cream">Ready in 20 min</span>
      </div>
      <div className="glass absolute bottom-16 -right-4 z-20 px-4 py-2 rounded-2xl flex items-center gap-2 animate-fade-up-delay-4">
        <Star className="w-4 h-4 text-gold fill-gold" />
        <span className="text-sm font-medium text-cream">4.9 · 2.4k reviews</span>
      </div>
    </div>
  );
}

/* ─── GSAP scroll-reveal hook ────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".reveal-left").forEach((el) => {
        gsap.to(el, { opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".reveal-right").forEach((el) => {
        gsap.to(el, { opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".reveal-scale").forEach((el) => {
        gsap.to(el, { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
      });
    });
    return () => ctx.revert();
  }, []);
}

/* ─── Parallax hero bg ───────────────────────────────────── */
function useParallax(ref: React.RefObject<HTMLElement>, speed = 0.4) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.to(el, { yPercent: speed * 40, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, [ref, speed]);
}

/* ─── Spotlight Dish Card ────────────────────────────────── */
function DishCard({ dish }: { dish: MenuItem }) {
  const [err, setErr] = useState(false);

  return (
    <motion.div variants={cardReveal} whileHover={{ scale: 1.025 }} style={{ originX: 0.5, originY: 0.5 }}>
      <SpotlightCard className="relative overflow-hidden rounded-2xl bg-charcoal-mid border border-white/5 transition-all duration-300 hover:border-sienna/20 hover:shadow-[0_12px_48px_rgba(0,0,0,0.5),0_0_32px_rgba(196,98,58,0.18)]">
        <Link to="/menu" className="group block">
          <div className="relative h-52 overflow-hidden">
            {!err ? (
              <img
                src={dish.image}
                alt={dish.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => setErr(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sienna/10 to-gold/10">
                <span className="text-5xl">🍽️</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-sienna/0 group-hover:bg-sienna/8 transition-colors duration-300" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <span className="text-cream font-semibold text-lg leading-tight drop-shadow">{dish.name}</span>
              <span className="glass px-3 py-1 rounded-full text-sienna font-bold text-sm transition-all duration-300 group-hover:bg-sienna group-hover:text-cream">₹{dish.price}</span>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <p className="text-muted-foreground text-xs line-clamp-1 flex-1 mr-3 transition-colors duration-300 group-hover:text-cream/70">{dish.description}</p>
            {dish.preparationTime && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Clock className="w-3 h-3" />{dish.preparationTime}m
              </span>
            )}
          </div>
        </Link>
      </SpotlightCard>
    </motion.div>
  );
}

/* ─── Staggered Grid wrapper (scroll-triggered) ─────────── */
function ChefPicksGrid({ dishes }: { dishes: MenuItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
    >
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function Index() {
  const [popularDishes, setPopularDishes] = useState<MenuItem[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const heroBgRef = useRef<HTMLDivElement>(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useScrollReveal();
  useParallax(heroBgRef as React.RefObject<HTMLElement>);

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/dishes`)
      .then((r) => r.json())
      .then((data) => {
        setPopularDishes(
          data.slice(0, 6).map((d: any) => ({
            id: d._id || d.id,
            name: d.name,
            description: d.description || "",
            price: d.price,
            image: d.imageUrl
              ? d.imageUrl.startsWith("http") ? d.imageUrl : `${BACKEND_URL}${d.imageUrl}`
              : "",
            available: d.available,
            preparationTime: d.preparationTime || 15,
          }))
        );
      })
      .catch(() => {});
  }, [BACKEND_URL]);

  const stats = [
    { value: "120+", label: "Dishes", icon: <ChefHat className="w-5 h-5" /> },
    { value: "4.9★", label: "Rating", icon: <Star className="w-5 h-5" /> },
    { value: "20min", label: "Avg. Ready", icon: <Clock className="w-5 h-5" /> },
    { value: "5k+", label: "Happy Guests", icon: <Users className="w-5 h-5" /> },
  ];

  const whyUs = [
    { icon: <Flame className="w-6 h-6" />, title: "Cooked Fresh", desc: "Every dish prepared to order with farm-fresh ingredients." },
    { icon: <Leaf className="w-6 h-6" />, title: "Clean & Hygienic", desc: "Strict kitchen standards you can trust every single time." },
    { icon: <Truck className="w-6 h-6" />, title: "Fast Pickup", desc: "Real-time order tracking from kitchen to counter." },
    { icon: <Award className="w-6 h-6" />, title: "Award Winning", desc: "Recognised for authentic flavours and consistent quality." },
  ];

  const FALLBACK: MenuItem[] = [
    { id: 'f1', name: 'Butter Chicken',         price: 229, description: 'Tender chicken in rich, creamy tomato gravy with butter.',    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop&q=80', available: true, preparationTime: 20, category: 'Indian' },
    { id: 'f2', name: 'Hyderabadi Dum Biryani', price: 259, description: 'Slow-cooked aromatic rice with marinated meat and saffron.',   image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop&q=80', available: true, preparationTime: 30, category: 'Indian' },
    { id: 'f3', name: 'Paneer Tikka',           price: 219, description: 'Marinated paneer cubes grilled with bell peppers and onions.', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop&q=80', available: true, preparationTime: 18, category: 'Indian' },
    { id: 'f4', name: 'Masala Dosa',            price: 129, description: 'Crispy rice crepe filled with spiced potato masala.',          image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&h=600&fit=crop&q=80', available: true, preparationTime: 15, category: 'South Indian' },
    { id: 'f5', name: 'Chole Bhature',          price: 149, description: 'Spicy chickpea curry served with fluffy fried bread.',         image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&h=600&fit=crop&q=80', available: true, preparationTime: 18, category: 'Indian' },
    { id: 'f6', name: 'Tandoori Chicken',       price: 279, description: 'Marinated chicken grilled in tandoor with yogurt and spices.', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&h=600&fit=crop&q=80', available: true, preparationTime: 25, category: 'Indian' },
  ];
  const dishes = popularDishes.length > 0 ? popularDishes.slice(0, 6) : FALLBACK;

  return (
    <div className="bg-background grain">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-8">
        <div ref={heroBgRef} className="absolute inset-0 z-0" style={{ background: "hsl(220 13% 9%)" }}>
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1800&q=80&fit=crop"
            alt=""
            className="w-full h-[120%] object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sienna/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative z-10 py-16 grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: hero label + word-by-word h1 + body + buttons ── */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={heroContainerVariants}
          >
            {/* Label — fades in as one unit */}
            <motion.div variants={wordReveal}>
              <span className="inline-flex items-center gap-2 text-sienna text-sm font-medium tracking-[0.2em] uppercase mb-4">
                <span className="w-8 h-px bg-sienna" />
                Chef's Signature
              </span>
            </motion.div>

            {/* ── MASKED WORD-BY-WORD HEADLINE ── */}
            <AnimatedHeadline
              className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-cream"
              lines={[
                [{ text: "Taste" }, { text: "the" }],
                [{ text: "Art", className: "text-gradient italic" }, { text: "of" }],
                [{ text: "Indian" }, { text: "Food" }],
              ]}
            />

            <motion.p
              className="text-muted-foreground text-lg leading-relaxed max-w-md"
              variants={wordReveal}
            >
              Every dish is a story — crafted with heirloom spices, slow-cooked gravies, and a passion for authentic flavour that lingers long after the last bite.
            </motion.p>

            <motion.div className="flex flex-wrap gap-4" variants={wordReveal}>
              <Link to="/menu">
                <motion.div whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
                  <Button size="lg" className="h-14 px-10 bg-sienna hover:bg-sienna-light text-cream rounded-full text-base font-medium btn-magnetic shadow-lg shadow-sienna/25 transition-all duration-300">
                    Explore Menu
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/about">
                <motion.div whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
                  <Button size="lg" variant="ghost" className="h-14 px-10 rounded-full text-base border border-white/10 hover:border-sienna/40 hover:bg-sienna/5 text-cream transition-all duration-300">
                    Our Story
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div className="grid grid-cols-4 gap-4 pt-4" variants={wordReveal}>
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-sienna mb-1 flex justify-center">{s.icon}</div>
                  <div className="font-serif text-xl font-bold text-cream">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right — 3D plate ── */}
          <motion.div
            className="hidden lg:flex flex-col items-center gap-6 justify-center"
            variants={heroPlatVariants}
            initial="hidden"
            animate="visible"
          >
            <HeroPlate mouseX={mousePos.x} mouseY={mousePos.y} />
            <Link to="/menu" className="w-full max-w-[360px]">
              <motion.div
                className="glass rounded-2xl px-6 py-4 flex items-center justify-between border border-sienna/20 hover:border-sienna/50 hover:bg-sienna/5 transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div>
                  <p className="text-xs text-sienna font-medium tracking-widest uppercase mb-0.5">Ready to order?</p>
                  <p className="text-cream font-semibold text-base">Browse Full Menu</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-sienna flex items-center justify-center shadow-lg shadow-sienna/30 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5 text-cream" />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Mobile CTA */}
          <div className="lg:hidden animate-fade-up-delay-3">
            <div className="glass rounded-3xl p-8 text-center border border-sienna/20">
              <div className="w-16 h-16 rounded-2xl bg-sienna/15 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-sienna" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-cream mb-2">120+ Dishes</h3>
              <p className="text-muted-foreground text-sm mb-6">From rich curries to crispy street food — something for every craving.</p>
              <Link to="/menu">
                <motion.div whileTap={{ scale: 0.95 }} style={{ display: "inline-block", width: "100%" }}>
                  <Button size="lg" className="w-full h-12 bg-sienna hover:bg-sienna-light text-cream rounded-full font-medium shadow-lg shadow-sienna/25">
                    Browse Menu <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="hsl(220 13% 9%)" />
          </svg>
        </div>
      </section>

      {/* ── MARQUEE STRIP ────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-sienna/10 border-y border-sienna/20 py-4">
        <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {["Butter Chicken", "Biryani", "Masala Dosa", "Paneer Tikka", "Chole Bhature", "Tandoori", "Rogan Josh", "Gulab Jamun",
            "Butter Chicken", "Biryani", "Masala Dosa", "Paneer Tikka", "Chole Bhature", "Tandoori", "Rogan Josh", "Gulab Jamun"].map((item, i) => (
            <span key={i} className="text-sm font-medium text-sienna/80 tracking-widest uppercase flex items-center gap-4">
              {item} <span className="text-sienna">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── CHEF'S PICKS — SPOTLIGHT + STAGGER GRID ────────── */}
      <section className="py-12 relative">
        <div className="container">
          <div className="text-center mb-8">
            <span className="text-sienna text-sm font-medium tracking-[0.2em] uppercase">From the Kitchen</span>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-cream mt-3">Chef's Picks</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Handpicked favourites that keep our guests coming back for more.
            </p>
          </div>

          <ChefPicksGrid dishes={dishes} />

          <div className="text-center mt-6">
            <Link to="/menu">
              <motion.div whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
                <Button size="lg" variant="outline" className="h-14 px-12 rounded-full border-sienna/40 text-sienna hover:bg-sienna hover:text-cream hover:border-sienna transition-all duration-300 text-base">
                  View Full Menu
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80&fit=crop" alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden sienna-glow">
                <img src="/why_choose_us.png" alt="Why choose us" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="glass absolute -bottom-6 -right-6 p-5 rounded-2xl max-w-[200px]">
                <div className="text-3xl font-serif font-bold text-sienna">98%</div>
                <div className="text-sm text-muted-foreground mt-1">Customer satisfaction rate</div>
              </div>
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-sienna/15 animate-morph blur-xl" />
            </div>

            <div className="space-y-10">
              <div>
                <span className="text-sienna text-sm font-medium tracking-[0.2em] uppercase">Why Foodizzz</span>
                <h2 className="font-serif text-5xl font-bold text-cream mt-3 leading-tight">
                  Food is more than<br />
                  <span className="text-gradient italic">a meal</span>
                </h2>
                <p className="text-muted-foreground mt-5 leading-relaxed">
                  We believe every plate should tell a story. From sourcing the finest spices to plating with care — every detail matters.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {whyUs.map((item) => (
                  <motion.div
                    key={item.title}
                    className="glass p-5 rounded-2xl group hover:border-sienna/30 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -3 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-sienna/15 flex items-center justify-center text-sienna mb-4 group-hover:bg-sienna/25 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-cream mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH FOOD SHOWCASE ──────────────────────────── */}
      <section className="relative h-[70vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1800&q=80&fit=crop" alt="Indian feast"
          className="w-full h-[120%] object-cover -mt-[10%]" style={{ objectPosition: "center 40%" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-xl">
              <span className="text-sienna text-sm font-medium tracking-[0.2em] uppercase">The Experience</span>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-cream mt-3 leading-tight">A feast for all<br />the senses</h2>
              <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
                Aromas that transport you, textures that delight, and flavours that linger — this is what we serve.
              </p>
              <Link to="/menu" className="inline-block mt-8">
                <motion.div whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
                  <Button size="lg" className="h-14 px-10 bg-sienna hover:bg-sienna-light text-cream rounded-full btn-magnetic shadow-lg shadow-sienna/25">
                    Order Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 rotate-180">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="hsl(220 13% 9%)" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="hsl(220 13% 9%)" />
          </svg>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-sienna text-sm font-medium tracking-[0.2em] uppercase">Testimonials</span>
            <h2 className="font-serif text-5xl font-bold text-cream mt-3">What guests say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", text: "The Butter Chicken here is the best I've had outside my grandmother's kitchen. Absolutely divine.", rating: 5 },
              { name: "Rahul M.", text: "Hyderabadi Biryani was perfectly layered — every grain of rice was infused with flavour. Will be back.", rating: 5 },
              { name: "Ananya K.", text: "The ambience, the food, the speed — everything is top-notch. My go-to for special occasions.", rating: 5 },
            ].map((t, i) => (
              <motion.div
                key={i}
                className="glass p-8 rounded-3xl card-premium"
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <div className="flex gap-1 mb-5">
                  {Array(t.rating).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 text-gold fill-gold" />)}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sienna/20 flex items-center justify-center text-sienna font-bold text-sm">{t.name[0]}</div>
                  <span className="font-medium text-cream">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sienna/20 via-background to-gold/10" />
        <div className="absolute top-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 rotate-180">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="hsl(220 13% 9%)" />
          </svg>
        </div>
        <div className="container relative z-10 text-center">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-cream mb-6">
            Ready to <span className="text-shimmer">indulge?</span>
          </h2>
          <p className="text-muted-foreground text-xl mb-10 max-w-xl mx-auto">Fresh, authentic Indian food — just a few taps away.</p>
          <Link to="/menu">
            <motion.div whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
              <Button size="lg" className="h-16 px-14 bg-sienna hover:bg-sienna-light text-cream rounded-full text-lg font-medium btn-magnetic shadow-2xl shadow-sienna/30 animate-pulse-glow">
                Order Now
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
          <BrandLogo size="sm" />
          <p>© {new Date().getFullYear()} Foodizzz. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/menu" className="hover:text-sienna transition-colors">Menu</Link>
            <Link to="/about" className="hover:text-sienna transition-colors">About</Link>
            <Link to="/contact" className="hover:text-sienna transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
