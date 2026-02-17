import { ShoppingCart, LogOut, User, Menu as MenuIcon, Home, Phone, Info } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  cartItemsCount?: number;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export function Navbar({ cartItemsCount = 0, isAdmin = false, onLogout }: NavbarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:bg-primary/90 transition-colors shadow-md">
            <span className="text-primary-foreground font-bold text-xl">O</span>
          </div>
          <span className="font-bold text-2xl text-foreground">OrderEase</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {!isAdmin ? (
            <>
              <Link to="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'}
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              <Link to="/menu">
                <Button 
                  variant={isActive('/menu') ? 'default' : 'ghost'}
                  className="gap-2"
                >
                  <MenuIcon className="w-4 h-4" />
                  Menu
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  variant={isActive('/about') ? 'default' : 'ghost'}
                  className="gap-2"
                >
                  <Info className="w-4 h-4" />
                  About
                </Button>
              </Link>
              <Link to="/track">
                <Button 
                  variant={isActive('/track') ? 'default' : 'ghost'}
                >
                  Track Order
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant={isActive('/contact') ? 'default' : 'ghost'}
                  className="gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Contact
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/admin/dashboard">
              <Button 
                variant={isActive('/admin/dashboard') ? 'default' : 'ghost'}
              >
                Dashboard
              </Button>
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {!isAdmin ? (
            <Link to="/cart">
              <Button variant="outline" size="default" className="relative h-10 px-4 gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout} className="h-10">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}