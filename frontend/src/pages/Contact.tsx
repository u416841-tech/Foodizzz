import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: "+91 8857905666",
      link: "tel:91 8857905666"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: "wadiledev25@gmail.com",
      link: "mailto:wadiledev25@gmail.com"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      details: "1504 IBMM Road Dange Chowk Wakad Pune",
      link: "#"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Hours",
      details: "Mon-Sun: 9:00 AM - 10:00 PM",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-16 px-4 pt-32">
        <div className="text-center mb-16 page-fade-up">
          <span className="text-sienna text-sm font-medium tracking-[0.2em] uppercase">Reach Out</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-cream mt-3 mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Card className="border-border page-slide-left stagger-1 transition-all duration-300 hover:border-sienna/20 hover:shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="transition-all duration-200 focus-within:translate-x-1">
                  <Label htmlFor="name" className="text-sm font-semibold mb-2 block">Full Name</Label>
                  <Input id="name" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name" required />
                </div>
                <div className="transition-all duration-200 focus-within:translate-x-1">
                  <Label htmlFor="email" className="text-sm font-semibold mb-2 block">Email Address</Label>
                  <Input id="email" type="email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email" required />
                </div>
                <div className="transition-all duration-200 focus-within:translate-x-1">
                  <Label htmlFor="phone" className="text-sm font-semibold mb-2 block">Phone Number</Label>
                  <Input id="phone" type="tel" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone no" />
                </div>
                <div className="transition-all duration-200 focus-within:translate-x-1">
                  <Label htmlFor="message" className="text-sm font-semibold mb-2 block">Message</Label>
                  <Textarea id="message" value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can help you..." rows={5} required />
                </div>
                <Button type="submit" size="lg" className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sienna/25">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6 page-slide-right stagger-2">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground mb-8">Feel free to reach out through any of the following channels.</p>
            </div>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index}
                  className={`border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-sienna/30 page-fade-up stagger-${index + 1}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary transition-all duration-300 hover:bg-sienna/20 hover:text-sienna">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                        {info.link !== "#" ? (
                          <a href={info.link} className="text-muted-foreground hover:text-sienna transition-colors duration-200">
                            {info.details}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{info.details}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-border overflow-hidden page-fade-in stagger-5 transition-all duration-300 hover:border-sienna/20">
              <div className="w-full h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.121168094942!2d73.90674631490255!3d18.56197098741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c14df5c70e0d%3A0x2d19689e09e2fced!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="Foodizzz Location" />
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-background border-t border-border py-8 text-center text-muted-foreground text-sm mt-16">
        <div className="container mx-auto px-4 flex flex-col items-center gap-3">
          <BrandLogo size="sm" />
          <p>© {new Date().getFullYear()} Foodizzz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
