import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, User, Code, Coins, TrendingUp, Recycle } from "lucide-react";
import { toast } from "sonner";

interface Company {
  id: string;
  name: string;
  company_slug: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  welcome_message: string;
  min_withdrawal_amount: number;
  points_per_kg: number;
}

interface Profile {
  full_name: string;
  username: string;
  unique_code: string;
  points: number;
}

const CompanyPortal = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCompanyAndProfile();
  }, [slug]);

  const fetchCompanyAndProfile = async () => {
    try {
      // Fetch company by slug
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("company_slug", slug)
        .single();

      if (companyError) throw companyError;
      setCompany(companyData);

      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
      }
    } catch (error: any) {
      toast.error("Failed to load company portal");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!profile || !company) return;

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < company.min_withdrawal_amount) {
      toast.error(`Minimum withdrawal amount is ₦${company.min_withdrawal_amount}`);
      return;
    }

    const pointsNeeded = amount;
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

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ points: profile.points - pointsNeeded })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      toast.success("Withdrawal request submitted!");
      setWithdrawAmount("");
      setDialogOpen(false);
      fetchCompanyAndProfile();
    } catch (error: any) {
      toast.error("Failed to process withdrawal");
      console.error(error);
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Portal Not Found</CardTitle>
            <CardDescription>This company portal does not exist</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const brandColors = {
    primary: company.primary_color || "#10b981",
    secondary: company.secondary_color || "#059669",
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${brandColors.primary}15 0%, ${brandColors.secondary}10 100%)`
      }}
    >
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="h-8 sm:h-10 w-auto" />
            ) : (
              <Recycle className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: brandColors.primary }} />
            )}
            <div>
              <h1 className="text-lg sm:text-2xl font-bold truncate max-w-[150px] sm:max-w-none" style={{ color: brandColors.primary }}>
                {company.name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Rewards Portal</p>
            </div>
          </div>
          {!profile && (
            <Button 
              onClick={() => navigate("/auth")}
              style={{ backgroundColor: brandColors.primary }}
              className="hover:opacity-90"
              size="sm"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        {company.welcome_message && (
          <Card className="mb-8">
            <CardContent className="p-6 text-center">
              <p className="text-lg">{company.welcome_message}</p>
            </CardContent>
          </Card>
        )}

        {profile ? (
          <>
            <h2 className="text-2xl font-bold mb-6" style={{ color: brandColors.primary }}>
              Welcome, {profile.full_name}!
            </h2>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Full Name</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.full_name}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Username</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">@{profile.username}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Code</CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono">{profile.unique_code}</div>
                  <p className="text-xs text-muted-foreground mt-1">Use at recycling bins</p>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: `${brandColors.primary}20` }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Points Balance</CardTitle>
                  <Coins className="h-4 w-4" style={{ color: brandColors.primary }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: brandColors.primary }}>
                    {profile.points.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">pts</p>
                </CardContent>
              </Card>
            </div>

            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Withdraw Funds
                </CardTitle>
                <CardDescription>
                  Convert your points to cash (1 point = ₦1)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="p-4 rounded-lg" 
                  style={{ backgroundColor: `${brandColors.primary}15` }}
                >
                  <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                  <p className="text-3xl font-bold" style={{ color: brandColors.primary }}>
                    ₦{profile.points.toFixed(2)}
                  </p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full gap-2"
                      style={{ backgroundColor: brandColors.primary }}
                    >
                      <TrendingUp className="h-4 w-4" />
                      Request Withdrawal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Withdraw Funds</DialogTitle>
                      <DialogDescription>
                        Enter the amount you want to withdraw (minimum ₦{company.min_withdrawal_amount})
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₦)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder={company.min_withdrawal_amount.toString()}
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          min={company.min_withdrawal_amount}
                          step="0.01"
                        />
                        <p className="text-sm text-muted-foreground">
                          Points needed: {parseFloat(withdrawAmount).toFixed(2) || 0}
                        </p>
                      </div>
                      <Button
                        onClick={handleWithdraw}
                        disabled={withdrawing}
                        className="w-full"
                        style={{ backgroundColor: brandColors.primary }}
                      >
                        {withdrawing ? "Processing..." : "Confirm Withdrawal"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Join Our Rewards Program</CardTitle>
              <CardDescription>
                Sign in or create an account to start earning rewards for recycling
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div 
                className="p-6 rounded-lg"
                style={{ backgroundColor: `${brandColors.primary}15` }}
              >
                <Coins className="h-12 w-12 mx-auto mb-4" style={{ color: brandColors.primary }} />
                <p className="text-lg font-medium mb-2">Earn {company.points_per_kg} points per kg</p>
                <p className="text-muted-foreground">
                  Convert your points to cash and make a difference!
                </p>
              </div>
              <Button 
                onClick={() => navigate("/auth")}
                size="lg"
                className="w-full"
                style={{ backgroundColor: brandColors.primary }}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompanyPortal;
