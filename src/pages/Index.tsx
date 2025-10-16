import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle, Coins, MapPin, Trophy } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-background dark:via-green-950 dark:to-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-6">
            <Recycle className="h-16 w-16 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-green-800 dark:text-green-400 animate-fade-in">
          Trash to Cash
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground animate-fade-in">
          Turn your recyclables into rewards. Smart bins that automatically credit your account with points for every deposit.
        </p>
        <div className="flex justify-center gap-4 animate-fade-in">
          <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => navigate("/auth")}>
            <Coins className="h-5 w-5" />
            Start Earning
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/locations")}>
            <MapPin className="h-5 w-5" />
            Find Locations
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover-scale border-green-200 dark:border-green-900">
            <CardHeader>
              <Recycle className="mb-2 h-10 w-10 text-green-600 dark:text-green-400" />
              <CardTitle>Smart Recycling</CardTitle>
              <CardDescription>
                Use your unique code at any smart bin. Automatic detection of waste type and weight.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-scale border-green-200 dark:border-green-900">
            <CardHeader>
              <Coins className="mb-2 h-10 w-10 text-green-600 dark:text-green-400" />
              <CardTitle>Earn Rewards</CardTitle>
              <CardDescription>
                Get instant points for every deposit. Convert points to cash and withdraw anytime.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-scale border-green-200 dark:border-green-900">
            <CardHeader>
              <Trophy className="mb-2 h-10 w-10 text-green-600 dark:text-green-400" />
              <CardTitle>Compete & Win</CardTitle>
              <CardDescription>
                Climb the leaderboard and compete with other recyclers in your community.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-800 dark:text-green-400">
          How It Works
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your account and get your unique recycling code instantly.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Find a Location</h3>
              <p className="text-muted-foreground">
                Locate the nearest smart recycling bin using our interactive map.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Deposit & Earn</h3>
              <p className="text-muted-foreground">
                Enter your code, deposit recyclables, and watch your points grow automatically.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Withdraw Cash</h3>
              <p className="text-muted-foreground">
                Convert your points to cash (50 points = ₦200) and request withdrawal anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
