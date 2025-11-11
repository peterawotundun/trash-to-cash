import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle, TrendingUp, Award, MapPin, Mail, Phone } from "lucide-react";

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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-background dark:via-green-950 dark:to-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-6">
              <Recycle className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-green-800 dark:text-green-400 animate-fade-in">
            Revolutionizing Waste Sorting with Smart Automation ♻️
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground animate-fade-in">
            Empowering recycling companies with AI-powered waste sorting, real-time tracking, and data-driven insights — for a cleaner, smarter future.
          </p>
          <div className="flex justify-center gap-4 animate-fade-in">
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection("how-it-works")}
            >
              Know More
            </Button>
            <Button 
              size="lg" 
              className="gap-2 bg-green-600 hover:bg-green-700"
              onClick={() => navigate("/company-register")}
            >
              Join Us Now
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-400">
            Who We Are
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Trashformer is an innovative waste management company focused on automating the sorting of recyclable materials using AI-powered smart bins.
            We help recycling companies reduce labor costs, improve sorting accuracy, and track collection data in real time.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-800 dark:text-green-400">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="hover-scale border-green-200 dark:border-green-900">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
                    <Recycle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-center">1️⃣ Smart Sorting Bins</CardTitle>
                <CardDescription className="text-center">
                  Our bins use built-in AI and sensors to automatically identify, sort, and separate recyclable materials.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-scale border-green-200 dark:border-green-900">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
                    <TrendingUp className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-center">2️⃣ Real-Time Monitoring</CardTitle>
                <CardDescription className="text-center">
                  Partner companies can monitor bin activity, collection rates, and waste data from their personalized dashboard.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-scale border-green-200 dark:border-green-900">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
                    <Award className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-center">3️⃣ Optional Reward System</CardTitle>
                <CardDescription className="text-center">
                  Companies can enable reward points for individuals depositing recyclables — promoting sustainability and community engagement.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-400">
            We're Open for Partnerships
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Collaborate with Trashformer to transform waste management across Africa.
            Join us in creating a cleaner, data-driven recycling ecosystem.
          </p>
          <Button 
            size="lg" 
            className="gap-2 bg-green-600 hover:bg-green-700"
            onClick={() => navigate("/company-register")}
          >
            Partner with Us
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center items-center gap-8 text-muted-foreground">
              <a href="mailto:support@trashformer.com" className="flex items-center gap-2 hover:text-green-600 transition-colors">
                <Mail className="h-5 w-5" />
                support@trashformer.com
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-green-600 transition-colors">
                <Phone className="h-5 w-5" />
                Contact
              </a>
            </div>
            <p className="text-lg font-medium text-foreground">
              💼 Ready to partner? Let's build a cleaner future together.
            </p>
            <div className="flex justify-center gap-6">
              <a href="#" className="text-muted-foreground hover:text-green-600 transition-colors">LinkedIn</a>
              <a href="#" className="text-muted-foreground hover:text-green-600 transition-colors">X</a>
              <a href="#" className="text-muted-foreground hover:text-green-600 transition-colors">Instagram</a>
            </div>
            <p className="text-sm text-muted-foreground">
              🌍 Trashformer © 2025. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
