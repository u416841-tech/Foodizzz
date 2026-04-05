import { ShoppingCart, LogOut, User, Menu as MenuIcon, X, Shield } from "lucide-react";
import { Button } from "./button";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { BrandLogo } from "./brand-logo";

interface NavbarProps {
  cartItemsCount?: number;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export function Navbar({ cartItemsCount = 0, isAdmin = false, onLogout }: NavbarProps) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = isAdmin
    ? [{ to: "/admin/dashboard", label: "Dashboard" }]
    : [
        { to: "/", label: "Home" },
        { to: "/menu", label: "Menu" },
        { to: "/about", label: "About" },
        { to: "/track", label: "Track Order" },
        { to: "/contact", label: "Contact" },
      ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-white/8 shadow-2xl shadow-black/30"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container flex h-18 items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <BrandLogo size="sm" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <button
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
                  isActive(link.to)
                    ? "text-sienna"
                    : "text-muted-foreground hover:text-cream"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sienna" />
                )}
              </button>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!isAdmin ? (
            <>
              <Link to="/cart">
                <button className="relative p-2 text-muted-foreground hover:text-cream transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-sienna text-cream text-xs font-bold rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </Link>
              {/* Admin shortcut — subtle icon link */}
              <Link
                to="/admin/login"
                title="Admin Panel"
                className="p-2 text-muted-foreground hover:text-sienna transition-colors duration-200"
              >
                <Shield className="w-4 h-4" />
              </Link>
              <Link to="/menu">
                <Button size="sm" className="hidden md:flex h-9 px-5 bg-sienna hover:bg-sienna-light text-cream rounded-full text-sm font-medium shadow-lg shadow-sienna/25 transition-all">
                  Order Now
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <User className="w-4 h-4" /> Admin
              </span>
              <button onClick={onLogout} className="p-2 text-muted-foreground hover:text-cream transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-cream transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/8 px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
              <div className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.to) ? "bg-sienna/15 text-sienna" : "text-muted-foreground hover:text-cream hover:bg-white/5"
              }`}>
                {link.label}
              </div>
            </Link>
          ))}
          {!isAdmin && (
            <Link to="/menu" onClick={() => setMobileOpen(false)}>
              <Button className="w-full mt-3 bg-sienna hover:bg-sienna-light text-cream rounded-xl">
                Order Now
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
