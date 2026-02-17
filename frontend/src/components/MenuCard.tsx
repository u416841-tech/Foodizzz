import { MenuItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative h-56 overflow-hidden bg-muted">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!item.available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm px-4 py-1">Out of Stock</Badge>
            </div>
          )}
          {item.preparationTime && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-background/95 text-foreground backdrop-blur-sm">
                <Clock className="w-3 h-3 mr-1" />
                {item.preparationTime}m
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <CardTitle className="text-xl mb-2 line-clamp-1 font-semibold">{item.name}</CardTitle>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-foreground">₹{item.price}</span>
          {item.category && (
            <Badge variant="outline" className="text-xs">{item.category}</Badge>
          )}
        </div>
        <Button 
          className="w-full h-11" 
          onClick={() => onAddToCart(item)}
          disabled={!item.available}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}