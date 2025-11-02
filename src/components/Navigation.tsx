import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Home, MapPin, Trophy, History, LogOut, Recycle, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      toast.success("Logged out successfully");
      navigate("/auth");
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-green-600 dark:bg-green-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Recycle className="h-8 w-8" />
            <span className="text-xl font-bold">Trash to Cash</span>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-green-50">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-green-600 dark:bg-green-900 border-green-700">
              <div className="flex flex-col gap-2 mt-8">
                <NavLink to="/dashboard" onClick={() => setIsOpen(false)}>
                  {({ isActive }) => (
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        isActive
                          ? "bg-green-700 dark:bg-green-800 text-white"
                          : "text-green-50 hover:bg-green-700 dark:hover:bg-green-800"
                      }`}
                    >
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Button>
                  )}
                </NavLink>

                <NavLink to="/locations" onClick={() => setIsOpen(false)}>
                  {({ isActive }) => (
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        isActive
                          ? "bg-green-700 dark:bg-green-800 text-white"
                          : "text-green-50 hover:bg-green-700 dark:hover:bg-green-800"
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                      Locations
                    </Button>
                  )}
                </NavLink>

                <NavLink to="/leaderboard" onClick={() => setIsOpen(false)}>
                  {({ isActive }) => (
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        isActive
                          ? "bg-green-700 dark:bg-green-800 text-white"
                          : "text-green-50 hover:bg-green-700 dark:hover:bg-green-800"
                      }`}
                    >
                      <Trophy className="h-4 w-4" />
                      Leaderboard
                    </Button>
                  )}
                </NavLink>

                <NavLink to="/history" onClick={() => setIsOpen(false)}>
                  {({ isActive }) => (
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        isActive
                          ? "bg-green-700 dark:bg-green-800 text-white"
                          : "text-green-50 hover:bg-green-700 dark:hover:bg-green-800"
                      }`}
                    >
                      <History className="h-4 w-4" />
                      History
                    </Button>
                  )}
                </NavLink>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-green-50 hover:bg-green-700 dark:hover:bg-green-800"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={`gap-2 ${
                    isActive
                      ? "bg-green-700 dark:bg-green-800 text-white"
                      : "text-green-50 hover:bg-green-700 dark:hover:bg-green-800"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              )}
            </NavLink>

            <NavLink to="/locations">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={`gap-2 ${
                    isActive
                      ? "bg-green-700 dark:bg-green-800 text-white"
                      : "text-green-50 hover:bg-green-700 dark:hover:bg-green-800"
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  Locations
                </Button>
              )}
            </NavLink>

            <NavLink to="/leaderboard">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={`gap-2 ${
                    isActive
                      ? "bg-green-700 dark:bg-green-800 text-white"
                      : "text-green-50 hover:bg-green-700 dark:hover:bg-green-800"
                  }`}
                >
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </Button>
              )}
            </NavLink>

            <NavLink to="/history">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={`gap-2 ${
                    isActive
                      ? "bg-green-700 dark:bg-green-800 text-white"
                      : "text-green-50 hover:bg-green-700 dark:hover:bg-green-800"
                  }`}
                >
                  <History className="h-4 w-4" />
                  History
                </Button>
              )}
            </NavLink>

            <Button
              variant="ghost"
              className="gap-2 text-green-50 hover:bg-green-700 dark:hover:bg-green-800"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
