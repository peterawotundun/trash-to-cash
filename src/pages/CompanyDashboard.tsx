import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  LayoutDashboard, 
  MapPin, 
  Settings, 
  TrendingUp, 
  DollarSign,
  LogOut,
  Trash2
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string | null;
  contact_person: string;
  registration_number: string | null;
  cash_reward_enabled: boolean;
  points_per_kg: number;
}

interface Location {
  id: string;
  name: string;
  address: string;
  capacity_kg: number;
  current_weight_kg: number;
  status: string;
  latitude: number | null;
  longitude: number | null;
}

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/company-login");
        return;
      }

      await fetchCompanyData(user.email!);
      await fetchLocations();
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyData = async (email: string) => {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;
    setCompany(data);
  };

  const fetchLocations = async () => {
    if (!company?.id) return;
    
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("company_id", company.id);

    if (error) throw error;
    setLocations(data || []);
  };

  const handleToggleCashReward = async (enabled: boolean) => {
    if (!company) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("companies")
        .update({ cash_reward_enabled: enabled })
        .eq("id", company.id);

      if (error) throw error;

      setCompany({ ...company, cash_reward_enabled: enabled });
      toast({
        title: "Success",
        description: `Cash rewards ${enabled ? "enabled" : "disabled"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePointsRate = async () => {
    if (!company) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("companies")
        .update({ points_per_kg: company.points_per_kg })
        .eq("id", company.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Points rate updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!company) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("companies")
        .update({
          name: company.name,
          phone: company.phone,
          address: company.address,
          description: company.description,
          contact_person: company.contact_person,
        })
        .eq("id", company.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Company Not Found</CardTitle>
            <CardDescription>Unable to load company data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/company-login")}>Back to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalCapacity = locations.reduce((sum, loc) => sum + Number(loc.capacity_kg), 0);
  const totalCurrentWeight = locations.reduce((sum, loc) => sum + Number(loc.current_weight_kg), 0);
  const utilizationRate = totalCapacity > 0 ? (totalCurrentWeight / totalCapacity) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-background dark:via-green-950/20 dark:to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trash2 className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">
                {company.name}
              </h1>
              <p className="text-sm text-muted-foreground">Partner Dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="overview">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <DollarSign className="h-4 w-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="locations">
              <MapPin className="h-4 w-4 mr-2" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{locations.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active collection points</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{totalCapacity.toFixed(0)} kg</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all locations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{utilizationRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Current vs capacity</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Bin Status Overview
                </CardTitle>
                <CardDescription>Real-time status of your collection points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No locations added yet. Contact admin to add collection points.
                    </p>
                  ) : (
                    locations.map((location) => {
                      const fillPercentage = (Number(location.current_weight_kg) / Number(location.capacity_kg)) * 100;
                      return (
                        <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{location.name}</h4>
                            <p className="text-sm text-muted-foreground">{location.address}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{fillPercentage.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground">
                              {location.current_weight_kg} / {location.capacity_kg} kg
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cash Reward System</CardTitle>
                <CardDescription>
                  Enable rewards to incentivize public participation in waste collection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="cash-reward-toggle" className="text-base font-semibold">
                      Enable Cash Rewards
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Allow users to earn points for waste deposits
                    </p>
                  </div>
                  <Switch
                    id="cash-reward-toggle"
                    checked={company.cash_reward_enabled}
                    onCheckedChange={handleToggleCashReward}
                    disabled={saving}
                  />
                </div>

                {company.cash_reward_enabled && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div>
                      <Label htmlFor="points-rate">Points per Kilogram</Label>
                      <div className="flex gap-4 mt-2">
                        <Input
                          id="points-rate"
                          type="number"
                          value={company.points_per_kg}
                          onChange={(e) =>
                            setCompany({ ...company, points_per_kg: Number(e.target.value) })
                          }
                          min="1"
                          className="max-w-xs"
                        />
                        <Button onClick={handleUpdatePointsRate} disabled={saving}>
                          {saving ? "Saving..." : "Update Rate"}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Users will earn {company.points_per_kg} points for every kg of waste deposited
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Collection Locations</CardTitle>
                <CardDescription>Manage your Trashformer bin locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No locations found</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Contact admin to add collection points to your company
                      </p>
                    </div>
                  ) : (
                    locations.map((location) => (
                      <div key={location.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{location.name}</h4>
                            <p className="text-sm text-muted-foreground">{location.address}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              location.status === "available"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {location.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Capacity:</span>{" "}
                            <span className="font-medium">{location.capacity_kg} kg</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Current:</span>{" "}
                            <span className="font-medium">{location.current_weight_kg} kg</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Update your company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-person">Contact Person</Label>
                  <Input
                    id="contact-person"
                    value={company.contact_person}
                    onChange={(e) => setCompany({ ...company, contact_person: e.target.value })}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={company.email} disabled />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={company.phone}
                      onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={company.description || ""}
                    onChange={(e) => setCompany({ ...company, description: e.target.value })}
                    placeholder="Tell us about your company..."
                  />
                </div>

                <Button onClick={handleUpdateProfile} disabled={saving} className="w-full">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyDashboard;