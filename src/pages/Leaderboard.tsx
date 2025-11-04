import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";
import { toast } from "sonner";

interface LeaderboardEntry {
  id: string;
  username: string;
  full_name: string;
  points: number;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    fetchLeaderboard();
  };

  const fetchLeaderboard = async () => {
    try {
      // Fetch profiles excluding admins and unregistered users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name, points, is_registered")
        .eq("is_registered", true) // Only show fully registered users
        .order("points", { ascending: false });

      if (profilesError) throw profilesError;

      // Get admin user IDs
      const { data: adminRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (rolesError) throw rolesError;

      const adminIds = new Set(adminRoles?.map(r => r.user_id) || []);
      
      // Filter out admins and take top 100
      const filteredData = (profilesData || [])
        .filter(profile => !adminIds.has(profile.id))
        .slice(0, 100);

      setEntries(filteredData);
    } catch (error: any) {
      toast.error("Failed to load leaderboard");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-background dark:to-green-950">
      <Navigation />
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
          <Trophy className="h-6 w-6 md:h-8 md:w-8 text-green-600 dark:text-green-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-400">
            Top Recyclers
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:space-y-3">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-lg transition-colors ${
                    index < 3
                      ? "bg-green-50 dark:bg-green-950"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-center w-8 md:w-10">
                    {getRankIcon(index + 1)}
                  </div>

                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarFallback className="bg-green-600 text-white text-xs md:text-sm">
                      {getInitials(entry.full_name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm md:text-base truncate">{entry.full_name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">@{entry.username}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">
                      {entry.points.toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}

              {entries.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No recyclers yet. Be the first!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
