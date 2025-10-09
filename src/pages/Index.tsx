import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight animate-fade-in">
          Welcome to Your New Project
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground animate-fade-in">
          Start building something amazing with our powerful platform. Connected to Supabase and ready to scale.
        </p>
        <div className="flex justify-center gap-4 animate-fade-in">
          <Button size="lg" className="gap-2">
            <Sparkles className="h-5 w-5" />
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover-scale">
            <CardHeader>
              <Sparkles className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Modern Design</CardTitle>
              <CardDescription>
                Beautiful, responsive UI components built with Shadcn and Tailwind CSS
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-scale">
            <CardHeader>
              <Zap className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Powered by React, Vite, and optimized for peak performance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-scale">
            <CardHeader>
              <Shield className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Secure Backend</CardTitle>
              <CardDescription>
                Connected to Supabase with authentication, database, and storage ready
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
