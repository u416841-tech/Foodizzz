import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { MenuCard } from "@/components/MenuCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Remove mockMenuItems import, since we will use real data from backend
// import { mockMenuItems } from "@/data/mockData";
import { MenuItem } from "@/types";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";

export default function Menu() {
  // Backend URL configured from environment
  // State to hold menu items fetched from backend
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { addToCart, cartItems } = useCart();
  // State to show loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replace the old BACKEND_URL logic
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch dishes from backend API when component mounts
  useEffect(() => {
    // Why: To get real menu items from the database
    setLoading(true);
    fetch(`${BACKEND_URL}/api/dishes`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch menu items");
        return res.json();
      })
      .then((data) => {
        // Map backend dish data to MenuItem type and prefix image URLs
        const mapped = data.map((dish: any) => ({
          id: dish._id || dish.id,
          name: dish.name,
          description: dish.description || '',
          price: dish.price,
          image: dish.imageUrl
            ? dish.imageUrl.startsWith('http')
              ? dish.imageUrl
              : `${BACKEND_URL}${dish.imageUrl}`
            : '',
          available: dish.available,
          preparationTime: dish.preparationTime || 15, // fallback if not present
        }));
        setMenuItems(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty dependency array: runs once on mount

  // Filter menu items based only on search
  const filteredItems = menuItems.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartItems.length} />
      <main className="container py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our delicious selection of freshly prepared dishes, made with the finest ingredients.
          </p>
        </div>
        
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base border-border"
            />
          </div>
        </div>
        
        {/* Loading and Error States */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">Loading menu...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-lg text-destructive">{error}</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id || item._id}
                item={item}
                onAddToCart={(item) => {
                  addToCart(item);
                  toast({
                    title: "Added to cart",
                    description: `${item.name} has been added to your cart.`,
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-6">No items found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
              }}
            >
              Clear Search
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}