import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Utensils, Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const features = [
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: "Best Chef",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat"
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "120 Item food",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Clean Environment",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-foreground text-background py-20">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/abou1.png" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
       
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-background">
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat fringilla bibendum. Urna, elit augue urna, vitae feugiat pretium donec id elementum. Ultrices mattis sed vitae mus risus. Lacus nisi, et ac dapibus sit eu velit in consequat.
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
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat fringilla bibendum.
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
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} OrderEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
