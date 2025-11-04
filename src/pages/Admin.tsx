import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Building2, Users, Package, Wallet, Plus } from "lucide-react";

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registration_number: string | null;
  contact_person: string;
  description: string | null;
  created_at: string;
}

interface Transaction {
  id: string;
  user_id: string;
  weight_kg: number;
  points_earned: number;
  is_valid: boolean;
  created_at: string;
  profiles: { full_name: string; username: string } | null;
}

interface Withdrawal {
  id: string;
  user_id: string;
  amount_naira: number;
  points_deducted: number;
  status: string;
  created_at: string;
  profiles: { full_name: string; username: string } | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalWeight: 0,
    pendingWithdrawals: 0,
  });

  const [companyForm, setCompanyForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    registration_number: "",
    contact_person: "",
    description: "",
  });

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast.error("Access denied. Admin only.");
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      await Promise.all([
        fetchCompanies(),
        fetchTransactions(),
        fetchWithdrawals(),
        fetchStats(),
      ]);
    } catch (error) {
      console.error("Error checking admin:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const [usersData, transData, weightData, withdrawData] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("transactions").select("id", { count: "exact", head: true }),
      supabase.from("transactions").select("weight_kg"),
      supabase.from("withdrawals").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]);

    const totalWeight = weightData.data?.reduce((sum, t) => sum + Number(t.weight_kg), 0) || 0;

    setStats({
      totalUsers: usersData.count || 0,
      totalTransactions: transData.count || 0,
      totalWeight,
      pendingWithdrawals: withdrawData.count || 0,
    });
  };

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
    } else {
      setCompanies(data || []);
    }
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        profiles (full_name, username)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setTransactions(data || []);
    }
  };

  const fetchWithdrawals = async () => {
    const { data, error } = await supabase
      .from("withdrawals")
      .select(`
        *,
        profiles (full_name, username)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching withdrawals:", error);
    } else {
      setWithdrawals(data || []);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("companies").insert([companyForm]);

    if (error) {
      toast.error("Failed to register company");
      console.error(error);
    } else {
      toast.success("Company registered successfully");
      setCompanyForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        registration_number: "",
        contact_person: "",
        description: "",
      });
      fetchCompanies();
    }
  };

  const updateWithdrawalStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("withdrawals")
      .update({ status, processed_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update withdrawal");
    } else {
      toast.success(`Withdrawal ${status}`);
      fetchWithdrawals();
      fetchStats();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Admin Panel</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Weight (kg)</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWeight.toFixed(4)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingWithdrawals}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transactions and withdrawals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">View detailed information in the respective tabs.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Register New Recycling Company</CardTitle>
                <CardDescription>
                  Register recycling companies to partner with our waste management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Required Information:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Company name (official registered name)</li>
                    <li>• Valid email address for official correspondence</li>
                    <li>• Phone number (company contact line)</li>
                    <li>• Contact person (authorized representative)</li>
                    <li>• Physical address (headquarters or main office)</li>
                    <li>• Registration number (RC number or business registration - optional)</li>
                    <li>• Company description (services offered - optional)</li>
                  </ul>
                </div>

                <form onSubmit={handleCompanySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Company Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Vicfold Recyclers"
                        value={companyForm.name}
                        onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Official Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="company@example.com"
                        value={companyForm.email}
                        onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="+234 xxx xxxx xxx"
                        value={companyForm.phone}
                        onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_person">Contact Person *</Label>
                      <Input
                        id="contact_person"
                        placeholder="Authorized representative"
                        value={companyForm.contact_person}
                        onChange={(e) => setCompanyForm({ ...companyForm, contact_person: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="registration_number">Registration Number (RC Number)</Label>
                      <Input
                        id="registration_number"
                        placeholder="RC123456 (optional)"
                        value={companyForm.registration_number}
                        onChange={(e) => setCompanyForm({ ...companyForm, registration_number: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Physical Address *</Label>
                      <Input
                        id="address"
                        placeholder="Street, City, State"
                        value={companyForm.address}
                        onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description / Services Offered</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of recycling services (optional)"
                      value={companyForm.description}
                      onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    Register Company
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registered Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>{company.contact_person}</TableCell>
                          <TableCell>{company.email}</TableCell>
                          <TableCell>{company.phone}</TableCell>
                          <TableCell>{company.address}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Recent waste submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Weight (kg)</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {transaction.profiles?.full_name || "Unknown"}
                          </TableCell>
                          <TableCell>{Number(transaction.weight_kg).toFixed(4)}</TableCell>
                          <TableCell>{Number(transaction.points_earned).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.is_valid ? "default" : "destructive"}>
                              {transaction.is_valid ? "Valid" : "Invalid"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Requests</CardTitle>
                <CardDescription>Manage user withdrawal requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Amount (₦)</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawals.map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell>
                            {withdrawal.profiles?.full_name || "Unknown"}
                          </TableCell>
                          <TableCell>₦{Number(withdrawal.amount_naira).toFixed(2)}</TableCell>
                          <TableCell>{Number(withdrawal.points_deducted).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                withdrawal.status === "completed"
                                  ? "default"
                                  : withdrawal.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {withdrawal.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(withdrawal.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {withdrawal.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateWithdrawalStatus(withdrawal.id, "completed")}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateWithdrawalStatus(withdrawal.id, "failed")}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
