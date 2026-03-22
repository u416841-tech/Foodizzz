import { Navbar } from "@/components/ui/navbar";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Utensils, Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const features = [
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: "Best Chef",
      description: "Our experienced chefs bring passion and skill to every recipe, carefully crafting dishes with authentic flavors and perfect taste you can enjoy every time you order."
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "120 Item food",
      description: "Explore a wide variety of meals on our menu from quick bites to hearty favorites giving you plenty of delicious options to satisfy every craving."
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Clean Environment",
      description: "We follow strict hygiene and food safety standards in our kitchen, ensuring every meal is prepared in a clean, safe, and healthy environment you can trust."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-foreground text-background py-20 animate-fade-up pt-32">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/abou1.png" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 text-center">
          <span className="text-sienna text-sm font-medium tracking-[0.2em] uppercase">Our Story</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-cream mt-3">About Foodizzz</h1>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-background animate-fade-up">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left - Single Image */}
            <div>
              <img 
                src="/about2.png" 
                alt="Gourmet dish" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>

            {/* Right - Content */}
            <div className="space-y-6">
              <div>
                <span className="text-secondary text-sm font-semibold tracking-wider uppercase">
                  About us
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                  Food is an important<br />
                  part Of a balanced Diet
                </h2>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                Foodizzz is built on a love for good food and great service. We prepare every dish with fresh ingredients, balanced flavors, and attention to detail to ensure consistent quality. From the kitchen to your doorstep, our goal is simple deliver tasty, satisfying meals you can trust and enjoy every day.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/menu">
                  <Button size="lg" className="px-8">
                    Show more
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="px-8 gap-2">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  Watch video
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/50 animate-fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
               At Foodizzz, we serve more than just meals we serve comfort and freshness in every bite. Our dishes are prepared using carefully selected ingredients and cooked only after you order, ensuring rich flavor and perfect quality. Every order is packed with care and delivered hot to your doorstep, so you can enjoy delicious food anytime, anywhere.
            </p>
          </div>

          {/* Large Image */}
          <div className="max-w-5xl mx-auto mb-16">
            <img 
              src="/about3.png" 
              alt="Delicious healthy meals" 
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-border text-center">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-background border-t border-border py-8 text-center text-muted-foreground text-sm">
        <div className="container mx-auto px-4 flex flex-col items-center gap-3">
          <BrandLogo size="sm" />
          <p>© {new Date().getFullYear()} Foodizzz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
