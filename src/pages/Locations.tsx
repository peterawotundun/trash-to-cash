import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation as NavigationIcon } from "lucide-react";
import { toast } from "sonner";

interface Location {
  id: string;
  name: string;
  address: string;
  status: string;
  capacity_kg: number;
  current_weight_kg: number;
  latitude: number | null;
  longitude: number | null;
}

const Locations = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
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

    fetchLocations();
  };

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("name");

      if (error) throw error;
      setLocations(data || []);
    } catch (error: any) {
      toast.error("Failed to load locations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  const getCapacityPercentage = (current: number, capacity: number) => {
    return ((current / capacity) * 100).toFixed(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p>Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-background dark:to-green-950">
      <Navigation />
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-green-800 dark:text-green-400">
          Recycling Locations
        </h1>

        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Card key={location.id} className="hover-scale">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                      {location.name}
                    </CardTitle>
                    <CardDescription className="mt-2">{location.address}</CardDescription>
                  </div>
                  <Badge variant={location.status === "available" ? "default" : "destructive"}>
                    {location.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">
                      {getCapacityPercentage(location.current_weight_kg, location.capacity_kg)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all"
                      style={{
                        width: `${getCapacityPercentage(location.current_weight_kg, location.capacity_kg)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {location.current_weight_kg.toFixed(1)} / {location.capacity_kg} kg
                  </p>
                </div>

                {location.latitude && location.longitude && (
                  <button
                    onClick={() => openInMaps(location.latitude!, location.longitude!)}
                    className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:underline"
                  >
                    <NavigationIcon className="h-4 w-4" />
                    Get Directions
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {locations.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No locations available at the moment.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Locations;
