import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Home, MapPin, Trophy, History, LogOut, Recycle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      toast.success("Logged out successfully");
      navigate("/auth");
    }
  };

  return (
    <nav className="bg-green-600 dark:bg-green-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Recycle className="h-8 w-8" />
            <span className="text-xl font-bold">Trash to Cash</span>
          </div>

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
