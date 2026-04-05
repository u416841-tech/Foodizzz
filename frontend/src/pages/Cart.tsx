import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// ── Payment method types ──────────────────────────────────
type PaymentMethod = "cod" | "online" | null;

// ── Payment Selection Modal ───────────────────────────────
function PaymentModal({
  open, total, onClose, onConfirm,
}: {
  open: boolean; total: string;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => void;
}) {
  const [selected, setSelected] = useState<PaymentMethod>(null);

  const methods = [
    {
      id: "cod" as PaymentMethod,
      label: "Cash on Delivery",
      sub: "Pay when your order arrives",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="12" width="40" height="26" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <circle cx="24" cy="25" r="7" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <path d="M24 21v8M21 25h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M4 19h40" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      id: "online" as PaymentMethod,
      label: "Pay Online",
      sub: "Card / UPI / Net Banking via Razorpay",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="10" width="40" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <path d="M4 18h40" stroke="currentColor" strokeWidth="2.5"/>
          <rect x="10" y="26" width="8" height="5" rx="1.5" fill="currentColor" opacity="0.7"/>
          <rect x="22" y="26" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.4"/>
        </svg>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center p-4"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <div
              className="w-full max-w-md rounded-3xl border border-white/10 p-6 shadow-2xl"
              style={{
                background: "linear-gradient(145deg, hsl(220 13% 13%), hsl(220 13% 10%))",
                backdropFilter: "blur(40px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-cream">Choose Payment</h2>
                  <p className="text-muted-foreground text-sm mt-0.5">Total: <span className="text-sienna font-semibold">₹{total}</span></p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-cream transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Method cards */}
              <div className="space-y-3 mb-6">
                {methods.map((m) => {
                  const isSelected = selected === m.id;
                  return (
                    <motion.button
                      key={m.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelected(m.id)}
                      className="w-full text-left rounded-2xl border p-4 flex items-center gap-4 transition-all duration-200"
                      style={{
                        borderColor: isSelected ? "hsl(18 72% 52%)" : "rgba(255,255,255,0.08)",
                        background: isSelected
                          ? "linear-gradient(135deg, hsl(18 72% 52% / 0.12), hsl(18 72% 52% / 0.05))"
                          : "rgba(255,255,255,0.03)",
                        boxShadow: isSelected ? "0 0 0 1px hsl(18 72% 52% / 0.4), 0 4px 24px hsl(18 72% 52% / 0.15)" : "none",
                      }}
                    >
                      <div className={`shrink-0 transition-colors duration-200 ${isSelected ? "text-sienna" : "text-muted-foreground"}`}>
                        {m.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm transition-colors duration-200 ${isSelected ? "text-cream" : "text-foreground"}`}>
                          {m.label}
                        </p>
                        <p className="text-muted-foreground text-xs mt-0.5">{m.sub}</p>
                      </div>
                      {/* Selection indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isSelected ? "border-sienna bg-sienna" : "border-white/20"
                      }`}>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-cream"
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Confirm button */}
              <motion.div whileTap={{ scale: selected ? 0.97 : 1 }}>
                <Button
                  size="lg"
                  className="w-full rounded-2xl h-13 text-base font-semibold transition-all duration-300"
                  disabled={!selected}
                  onClick={() => selected && onConfirm(selected)}
                  style={{
                    background: selected ? "hsl(18 72% 52%)" : undefined,
                    boxShadow: selected ? "0 8px 24px hsl(18 72% 52% / 0.35)" : undefined,
                  }}
                >
                  {selected === "cod"
                    ? "Confirm — Cash on Delivery"
                    : selected === "online"
                    ? "Continue to Payment"
                    : "Select a payment method"}
                </Button>
              </motion.div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                🔒 Secured with 256-bit SSL encryption
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", address: "" });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // ── Tax rate — read from localStorage (set by Admin), default 5% ──
  const [taxRate, setTaxRate] = useState<number>(() => {
    const saved = localStorage.getItem("adminTaxRate");
    return saved ? parseFloat(saved) : 5;
  });

  // Re-read if Admin changes it while cart is open (storage event from another tab)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "adminTaxRate" && e.newValue) {
        setTaxRate(parseFloat(e.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ── Price calculations ────────────────────────────────────
  const subtotal  = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const taxAmount = subtotal * (taxRate / 100);   // ← dynamic rate
  const total     = subtotal + taxAmount;

  const handleCheckout = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({ title: "Missing details", description: "Please fill in your name and phone number.", variant: "destructive" });
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = (method: PaymentMethod) => {
    setIsPaymentModalOpen(false);
    if (method === "online") {
      // Route to Razorpay checkout page
      navigate("/checkout", { state: { cartItems, customerInfo, total: total.toFixed(2) } });
    } else {
      // Cash on Delivery — place order directly
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((i) => ({ name: i.menuItem.name, quantity: i.quantity, price: i.menuItem.price })),
          customer: { name: customerInfo.name, phone: customerInfo.phone, address: customerInfo.address || "" },
          status: "queued",
          source: "website",
        }),
      })
        .then((r) => r.json())
        .then((savedOrder) => {
          toast({ title: "Order placed!", description: "Your order is confirmed. Pay on delivery." });
          navigate("/confirmation", {
            state: { orderId: savedOrder.displayOrderId || savedOrder._id, customerInfo, cartItems, total: total.toFixed(2) },
          });
        })
        .catch(() => {
          toast({ title: "Order placed!", description: "Cash on delivery confirmed." });
          navigate("/track");
        });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemsCount={0} />
        <main className="container py-16 px-4">
          {/* AnimatePresence on the empty state so it fades in gracefully after last item is removed */}
          <AnimatePresence>
            <motion.div
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Your cart is empty</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Add some delicious items from our menu to get started
              </p>
              <Link to="/menu">
                <Button size="lg">Browse Menu</Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartItems.length} />

      {/* ── Payment Selection Modal ── */}
      <PaymentModal
        open={isPaymentModalOpen}
        total={total.toFixed(2)}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handleConfirmPayment}
      />
      <main className="container py-12 px-4 page-fade-up pt-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Cart</h1>
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Cart Items — each one can exit with AnimatePresence ── */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence initial={false}>
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item.menuItem.id}
                    layout
                    initial={{ opacity: 0, x: -24, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: -32, scale: 0.97, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <Card
                      className="border-border transition-all duration-300 hover:border-sienna/20 hover:shadow-lg"
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-24 h-24 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1">{item.menuItem.name}</h3>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.menuItem.description}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              {item.menuItem.category && <Badge variant="outline" className="text-xs">{item.menuItem.category}</Badge>}
                              {item.menuItem.preparationTime && <span className="text-xs text-muted-foreground">{item.menuItem.preparationTime}m prep</span>}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-3">
                            <span className="font-bold text-xl">₹{(item.menuItem.price * item.quantity).toFixed(2)}</span>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)} className="h-8 w-8 p-0 transition-all duration-200 hover:border-sienna/40 hover:text-sienna">
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <Button variant="outline" size="sm" onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)} className="h-8 w-8 p-0 transition-all duration-200 hover:border-sienna/40 hover:text-sienna">
                                <Plus className="w-4 h-4" />
                              </Button>
                              {/* Trash — whileTap so it feels tactile */}
                              <motion.div whileTap={{ scale: 0.85 }}>
                                <Button variant="outline" size="sm" onClick={() => removeFromCart(item.menuItem.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="border-border transition-all duration-300 hover:border-sienna/20">
                  <CardHeader><CardTitle className="text-xl">Contact Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-semibold mb-2 block">Full Name</Label>
                      <Input id="name" value={customerInfo.name} onChange={(e) => setCustomerInfo((p) => ({ ...p, name: e.target.value }))} placeholder="Enter your name" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-semibold mb-2 block">Phone Number</Label>
                      <Input id="phone" value={customerInfo.phone} onChange={(e) => setCustomerInfo((p) => ({ ...p, phone: e.target.value }))} placeholder="Enter your phone number" />
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-sm font-semibold mb-2 block">Delivery Address</Label>
                      <Input id="address" value={customerInfo.address} onChange={(e) => setCustomerInfo((p) => ({ ...p, address: e.target.value }))} placeholder="Enter your delivery address" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="border-border transition-all duration-300 hover:border-sienna/20">
                  <CardHeader><CardTitle className="text-xl">Order Summary</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-base"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                      <span className="font-semibold">₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4"><div className="flex justify-between font-bold text-xl"><span>Total</span><span className="text-primary">₹{total.toFixed(2)}</span></div></div>
                    <motion.div whileTap={{ scale: 0.97 }}>
                      <Button className="w-full transition-all duration-300 hover:shadow-lg hover:shadow-sienna/25" size="lg" onClick={handleCheckout}>
                        Proceed to Checkout →
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}