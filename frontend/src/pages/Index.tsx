import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar";
import { ChefHat, Clock, Truck, Award, ArrowRight, MapPin, CreditCard, Package, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { MenuItem } from "@/types";

const Index = () => {
  const { toast } = useToast();
  const [popularDishes, setPopularDishes] = useState<MenuItem[]>([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const features = [
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: "Fresh Ingredients",
      description: "Locally-sourced, premium quality ingredients in every dish"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Service",
      description: "Fast preparation without compromising quality"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Quality",
      description: "Consistently high standards in every order"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Easy Pickup",
      description: "Simple ordering with real-time tracking"
    }
  ];

  const orderSteps = [
    { 
      icon: <MapPin className="w-5 h-5" />, 
      title: "Set your location first",
      description: "Choose your delivery area"
    },
    { 
      icon: <Package className="w-5 h-5" />, 
      title: "Choose the food you want to order",
      description: "Browse our delicious menu"
    },
    { 
      icon: <CreditCard className="w-5 h-5" />, 
      title: "Confirm order with payment method",
      description: "Secure and easy checkout"
    },
    { 
      icon: <CheckCircle2 className="w-5 h-5" />, 
      title: "Wait an moment and get your food",
      description: "Track your order in real-time"
    }
  ];

  const testimonials = [
    { name: "Sarah Johnson", text: "Best food ordering experience. Always fresh and on time.", rating: 5 },
    { name: "Michael Chen", text: "The quality is consistently excellent. Highly recommend!", rating: 5 },
    { name: "Emma Davis", text: "Simple interface, great food. What more could you ask for?", rating: 5 }
  ];

  useEffect(() => {
    toast({
      title: "Admin Login (for testing)",
      description: (
        <div>
          <div><b>Username:</b> admin</div>
          <div><b>Password:</b> admin123</div>
          <div className="mt-2">
            <a href="/admin/login" className="text-primary underline hover:text-secondary transition-colors">Go to Admin Panel</a>
          </div>
        </div>
      ),
      duration: 10000
    });

    // Fetch popular dishes
    fetch(`${BACKEND_URL}/api/dishes`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.slice(0, 6).map((dish: any) => ({
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
          preparationTime: dish.preparationTime || 15,
        }));
        setPopularDishes(mapped);
      })
      .catch(() => {});
  }, [toast, BACKEND_URL]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-background overflow-hidden min-h-[90vh] flex items-center">
        {/* Decorative Background Circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-primary/3 rounded-full blur-2xl"></div>
        
        {/* Decorative Leaves - Top Left */}
        <div className="absolute top-8 left-8 z-10 hidden lg:block">
          <img src="/top-leaf.png" alt="" className="w-24 h-auto" />
        </div>

        {/* Additional Small Leaves - Scattered */}
        <div className="absolute top-32 left-32 z-10 hidden lg:block opacity-60">
          <img src="/leaf.png" alt="" className="w-12 h-auto rotate-45" />
        </div>
        <div className="absolute top-48 left-20 z-10 hidden lg:block opacity-40">
          <img src="/leaf.png" alt="" className="w-10 h-auto -rotate-12" />
        </div>

        {/* Decorative Dots Pattern */}
        <div className="absolute top-40 right-1/4 hidden lg:block opacity-20">
          <div className="grid grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-primary rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Decorative Lines */}
        <div className="absolute bottom-32 left-16 hidden lg:block opacity-10">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path d="M10 10 Q 50 50 90 10" stroke="currentColor" strokeWidth="2" className="text-primary"/>
            <path d="M10 30 Q 50 70 90 30" stroke="currentColor" strokeWidth="2" className="text-secondary"/>
            <path d="M10 50 Q 50 90 90 50" stroke="currentColor" strokeWidth="2" className="text-primary"/>
          </svg>
        </div>

        {/* Dark Curved Background - Right Side */}
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <img 
            src="/black bg.png" 
            alt="" 
            className="absolute right-0 top-0 h-full w-auto object-cover object-left"
          />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-secondary text-lg md:text-xl font-bold tracking-wider uppercase">
                  CHEF'S SPECIAL
                </span>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Freshness<br />
                  in every bite
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quo studio.
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link to="/menu">
                  <Button size="lg" className="text-base px-10 h-14 bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all">
                    Download Recipe
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Food Image with Decorations */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              {/* Decorative Circle Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-2 border-primary/10 rounded-full hidden lg:block"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border-2 border-secondary/10 rounded-full hidden lg:block"></div>

              {/* Floating Lemon Slices - TOP LEFT of dish (repositioned and larger) */}
              <div className="absolute top-1 -left-16 z-0 hidden lg:block">
                <img 
                  src="/istockphoto-1338280922-170667a-removebg-preview 1.png" 
                  alt="" 
                  className="w-64 h-auto"
                />
              </div>

              {/* Small Leaf - Top of plate */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 hidden lg:block">
                <img 
                  src="/leaf.png" 
                  alt="" 
                  className="w-20 h-auto opacity-80"
                />
              </div>

              {/* Small Leaf - Top Right on dark bg */}
              <div className="absolute top-12 right-8 z-20 hidden lg:block">
                <img 
                  src="/leaf.png" 
                  alt="" 
                  className="w-24 h-auto opacity-70"
                />
              </div>

              {/* Additional decorative leaves */}
              <div className="absolute top-1/3 right-4 z-20 hidden lg:block opacity-50">
                <img 
                  src="/leaf.png" 
                  alt="" 
                  className="w-16 h-auto rotate-45"
                />
              </div>

              {/* Decorative small circles */}
              <div className="absolute top-24 right-24 w-3 h-3 bg-secondary rounded-full hidden lg:block opacity-60"></div>
              <div className="absolute top-32 right-16 w-2 h-2 bg-primary rounded-full hidden lg:block opacity-40"></div>
              <div className="absolute bottom-24 left-8 w-4 h-4 bg-secondary rounded-full hidden lg:block opacity-50"></div>
              <div className="absolute bottom-32 left-16 w-2 h-2 bg-primary rounded-full hidden lg:block opacity-30"></div>

              {/* Main Food Image */}
              <div className="relative w-full max-w-lg z-10">
                <img 
                  src="/hero1.png" 
                  alt="Delicious food" 
                  className="w-full h-auto relative z-10"
                />
              </div>

            

              {/* Decorative Leaves - Bottom Right on Dark BG */}
              <div className="absolute -bottom-8 -right-12 space-y-2 hidden lg:block z-20">
                <img src="/leaf.png" alt="" className="w-32 h-auto opacity-80" />
                <img src="/leaf.png" alt="" className="w-36 h-auto opacity-70 ml-6" />
              </div>

              {/* Social Media Icons - Right Side (on dark bg) */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 space-y-6 hidden lg:flex flex-col z-30">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xs">in</span>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xs">ig</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Follow Us Text - Vertical on Dark BG */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden lg:block z-30">
          <p className="text-white/60 text-sm tracking-widest" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            FOLLOW US
          </p>
        </div>
      </section>

      {/* Why People Choose Us Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left - Food Image */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img 
                  src="/why_choose_us.png" 
                  alt="Delicious healthy meal" 
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Why People Choose us?
                </h2>
              </div>

              <div className="space-y-6">
                {/* Convenient and Reliable */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Truck className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Convenient and Reliable</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Whether you dine in, take out, or order delivery, our service is convenient, fast, and reliable, making mealtime hassle-free.
                    </p>
                  </div>
                </div>

                {/* Variety of Options */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Package className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Variety of Options</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      From hearty meals to light snacks, we offer a wide range of options to suit every taste and craving.
                    </p>
                  </div>
                </div>

                {/* Eat Burger */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <ChefHat className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Eat Burger</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our burgers are grilled to perfection, with juicy patties and flavorful toppings that make every bite a delicious experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* We Offer Top Notch Section */}
      {popularDishes.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">We Offer Top Notch</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our delicious selection of freshly prepared dishes, made with the finest ingredients
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {popularDishes.map((dish) => (
                <Card key={dish.id} className="overflow-hidden border-border hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative h-64 overflow-hidden bg-muted">
                    <img 
                      src={dish.image} 
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-secondary text-white w-16 h-16 rounded-full flex items-center justify-center font-bold shadow-lg">
                      ₹{dish.price}
                    </div>
                    {/* Prep Time Badge */}
                    {dish.preparationTime && (
                      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
                        <Clock className="w-3 h-3" />
                        {dish.preparationTime}m
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2">{dish.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{dish.description}</p>
                    <Link to="/menu">
                      <Button variant="outline" className="w-full">Order Now</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/menu">
                <Button size="lg" className="px-10">
                  View Full Menu
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* A Very Simple Process Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left - Beef Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative">
                <img 
                  src="/beef.png" 
                  alt="Delicious beef dish" 
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  A Very Simple Process<br />
                  To Make Order Your<br />
                  Favourite Foods
                </h2>
              </div>

              <div className="space-y-4">
                {orderSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-background transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/menu">
                  <Button size="lg" className="px-8">
                    Order Food Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose OrderEase</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Committed to excellence in every order
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Want to be a part of Foodtime Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Background Image with Overlay */}
              <div className="relative h-[400px] md:h-[500px]">
                <img 
                  src="/foodtime.png" 
                  alt="Chef cooking with fire" 
                  className="w-full h-full object-cover"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    Want to be a part of Foodtime?
                  </h2>
                  <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                    List your restaurant or shop on foodtime.
                  </p>
                  <Link to="/contact">
                    <Button size="lg" variant="secondary" className="px-10 h-14 text-base shadow-xl hover:shadow-2xl transition-all">
                      Get started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer Reviews</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What our customers say about us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border bg-background">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-secondary fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{testimonial.text}</p>
                  <p className="font-semibold">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Browse our menu and place your order now. Fresh, delicious food is just a few clicks away.
          </p>
          <Link to="/menu">
            <Button size="lg" variant="secondary" className="text-base px-10 h-14 shadow-lg hover:shadow-xl transition-all">
              Order Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-background border-t border-border py-8 text-center text-muted-foreground text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} OrderEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
