import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle, Building2, LogIn, UserPlus, ArrowLeft } from "lucide-react";

const CompanyAuth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-background dark:via-green-950/50 dark:to-background">
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-700 p-6 shadow-2xl shadow-green-500/20">
                <Recycle className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Welcome to <span className="text-green-600 dark:text-green-400">Trashformer</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose an option below to continue with your journey towards smarter waste management
            </p>
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Login Card */}
            <Card className="hover-scale border-green-200 dark:border-green-900 bg-card shadow-lg cursor-pointer transition-all hover:border-green-400"
                  onClick={() => navigate("/company-login")}>
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-6">
                  <div className="rounded-2xl bg-green-100 dark:bg-green-900 p-5">
                    <LogIn className="h-14 w-14 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl mb-3">Existing Partner</CardTitle>
                <CardDescription className="text-base">
                  Already partnering with Trashformer? Sign in to access your company dashboard and manage your smart bins.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/company-login");
                  }}
                >
                  <LogIn className="h-5 w-5" />
                  Sign In
                </Button>
              </CardContent>
            </Card>

            {/* Register Card */}
            <Card className="hover-scale border-green-200 dark:border-green-900 bg-card shadow-lg cursor-pointer transition-all hover:border-green-400"
                  onClick={() => navigate("/company-register")}>
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-6">
                  <div className="rounded-2xl bg-green-100 dark:bg-green-900 p-5">
                    <Building2 className="h-14 w-14 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl mb-3">New Partnership</CardTitle>
                <CardDescription className="text-base">
                  Ready to transform your waste management? Register your company and start your partnership journey with us.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                  size="lg"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/company-register");
                  }}
                >
                  <UserPlus className="h-5 w-5" />
                  Partner With Us
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Need help? Contact us at{" "}
              <a href="mailto:support@trashformer.com" className="text-green-600 hover:underline">
                support@trashformer.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAuth;
