import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle, TrendingUp, Award, Mail, Phone, Linkedin, Twitter, Instagram } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-600 p-2">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-800 dark:text-green-400">
                Trashformer
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => scrollToSection("about")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection("how-it-works")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection("partnership")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Partnership
              </button>
              <Button 
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate("/company-auth")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-background dark:via-green-950/50 dark:to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 text-center relative">
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-700 p-8 shadow-2xl shadow-green-500/20">
              <Recycle className="h-20 w-20 text-white" />
            </div>
          </div>
          <h1 className="mb-6 text-4xl md:text-6xl font-bold tracking-tight text-foreground animate-fade-in">
            Revolutionizing Waste Sorting with{" "}
            <span className="text-green-600 dark:text-green-400">Smart Automation</span>
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-lg md:text-xl text-muted-foreground animate-fade-in leading-relaxed">
            Empowering recycling companies with AI-powered waste sorting, real-time tracking, and data-driven insights — for a cleaner, smarter future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection("how-it-works")}
              className="text-base"
            >
              Learn More
            </Button>
            <Button 
              size="lg" 
              className="gap-2 bg-green-600 hover:bg-green-700 text-base"
              onClick={() => navigate("/company-auth")}
            >
              Partner With Us
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-20 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              About <span className="text-green-600 dark:text-green-400">Trashformer</span>
            </h2>
            <div className="w-20 h-1 bg-green-600 mx-auto mb-6"></div>
          </div>
          <div className="bg-card border rounded-2xl p-8 md:p-12 shadow-lg">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
              <span className="font-semibold text-foreground">Trashformer</span> is an innovative waste management company focused on automating the sorting of recyclable materials using AI-powered smart bins.
              We help recycling companies reduce labor costs, improve sorting accuracy, and track collection data in real time. Our mission is to transform waste management across Africa through cutting-edge technology and sustainable practices.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/30 py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              How <span className="text-green-600 dark:text-green-400">Trashformer</span> Works
            </h2>
            <div className="w-20 h-1 bg-green-600 mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our three-step process makes waste management smarter and more efficient
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <Card className="hover-scale border-green-200 dark:border-green-900 bg-card shadow-lg">
              <CardHeader className="pb-8">
                <div className="flex justify-center mb-6">
                  <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-5 shadow-xl">
                    <Recycle className="h-14 w-14 text-white" />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <span className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-bold px-4 py-1 rounded-full">
                    STEP 1
                  </span>
                </div>
                <CardTitle className="text-center text-xl mb-3">Smart Sorting Bins</CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  Our bins use built-in AI and sensors to automatically identify, sort, and separate recyclable materials with precision and efficiency.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-scale border-green-200 dark:border-green-900 bg-card shadow-lg">
              <CardHeader className="pb-8">
                <div className="flex justify-center mb-6">
                  <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-5 shadow-xl">
                    <TrendingUp className="h-14 w-14 text-white" />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <span className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-bold px-4 py-1 rounded-full">
                    STEP 2
                  </span>
                </div>
                <CardTitle className="text-center text-xl mb-3">Real-Time Monitoring</CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  Partner companies can monitor bin activity, collection rates, and waste data from their personalized dashboard with live updates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-scale border-green-200 dark:border-green-900 bg-card shadow-lg">
              <CardHeader className="pb-8">
                <div className="flex justify-center mb-6">
                  <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-5 shadow-xl">
                    <Award className="h-14 w-14 text-white" />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <span className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-bold px-4 py-1 rounded-full">
                    STEP 3
                  </span>
                </div>
                <CardTitle className="text-center text-xl mb-3">Optional Reward System</CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  Companies can enable reward points for individuals depositing recyclables — promoting sustainability and community engagement.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="partnership" className="container mx-auto px-4 py-20 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 md:p-16 text-center shadow-2xl shadow-green-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              We're Open for Partnerships
            </h2>
            <p className="text-lg md:text-xl text-green-50 mb-10 leading-relaxed max-w-2xl mx-auto">
              Collaborate with <span className="font-bold">Trashformer</span> to transform waste management across Africa.
              Join us in creating a cleaner, data-driven recycling ecosystem.
            </p>
            <Button 
              size="lg" 
              className="gap-2 bg-white text-green-700 hover:bg-green-50 text-base font-semibold px-8"
              onClick={() => navigate("/company-auth")}
            >
              Start Your Partnership Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-green-600 p-2">
                    <Recycle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-green-800 dark:text-green-400">
                    Trashformer
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Revolutionizing waste management across Africa with smart AI-powered solutions for a sustainable future.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 text-lg">Get in Touch</h3>
                <div className="space-y-3">
                  <a href="mailto:support@trashformer.com" className="flex items-center gap-3 text-muted-foreground hover:text-green-600 transition-colors">
                    <Mail className="h-5 w-5 flex-shrink-0" />
                    <span>support@trashformer.com</span>
                  </a>
                  <a href="tel:+234" className="flex items-center gap-3 text-muted-foreground hover:text-green-600 transition-colors">
                    <Phone className="h-5 w-5 flex-shrink-0" />
                    <span>Contact Us</span>
                  </a>
                </div>
              </div>

              {/* Social */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 text-lg">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="p-3 rounded-lg bg-background border hover:border-green-600 hover:text-green-600 transition-all">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-3 rounded-lg bg-background border hover:border-green-600 hover:text-green-600 transition-all">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-3 rounded-lg bg-background border hover:border-green-600 hover:text-green-600 transition-all">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
                <p className="text-muted-foreground mt-6 leading-relaxed">
                  Ready to partner? Let's build a cleaner future together.
                </p>
              </div>
            </div>

            <div className="border-t pt-8 text-center text-sm text-muted-foreground">
              <p>© 2025 Trashformer. All Rights Reserved. Building a sustainable Africa, one smart bin at a time.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
