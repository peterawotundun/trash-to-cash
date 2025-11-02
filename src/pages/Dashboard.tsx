import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, User, Code, Coins, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  full_name: string;
  username: string;
  unique_code: string;
  points: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    fetchProfile();
  };

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!profile) return;

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const pointsNeeded = amount * 0.25; // ₦1 = 0.25 points (50 points = ₦200)
    if (pointsNeeded > profile.points) {
      toast.error("Insufficient points");
      return;
    }

    setWithdrawing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("withdrawals").insert({
        user_id: user?.id,
        points_deducted: pointsNeeded,
        amount_naira: amount,
        status: "pending",
      });

      if (error) throw error;

      // Update points
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ points: profile.points - pointsNeeded })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      toast.success("Withdrawal request submitted!");
      setWithdrawAmount("");
      setDialogOpen(false);
      fetchProfile();
      
      // Redirect to transaction history
      setTimeout(() => {
        navigate("/history");
      }, 500);
    } catch (error: any) {
      toast.error("Failed to process withdrawal");
      console.error(error);
    } finally {
      setWithdrawing(false);
    }
  };

  const nairaBalance = profile ? (profile.points * 4).toFixed(2) : "0.00";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-background dark:to-green-950">
      <Navigation />
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-green-800 dark:text-green-400">
          Welcome, {profile?.full_name}!
        </h1>

        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Full Name</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.full_name}</div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Username</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">@{profile?.username}</div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Code</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{profile?.unique_code}</div>
              <p className="text-xs text-muted-foreground mt-1">Use at recycling bins</p>
            </CardContent>
          </Card>

          <Card className="hover-scale bg-green-100 dark:bg-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Balance</CardTitle>
              <Coins className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {profile?.points.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">pts</p>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Withdraw Funds
            </CardTitle>
            <CardDescription>
              Convert your points to cash (50 points = ₦200)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                ₦{nairaBalance}
              </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Request Withdrawal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Enter the amount you want to withdraw (minimum ₦50)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₦)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="50"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min="50"
                      step="0.01"
                    />
                    <p className="text-sm text-muted-foreground">
                      Points needed: {(parseFloat(withdrawAmount) * 0.25).toFixed(2) || 0}
                    </p>
                  </div>
                  <Button
                    onClick={handleWithdraw}
                    disabled={withdrawing}
                    className="w-full"
                  >
                    {withdrawing ? "Processing..." : "Confirm Withdrawal"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
