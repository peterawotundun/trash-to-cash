import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History as HistoryIcon, Coins, Wallet } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Transaction {
  id: string;
  is_valid: boolean;
  weight_kg: number;
  points_earned: number;
  created_at: string;
}

interface Withdrawal {
  id: string;
  points_deducted: number;
  amount_naira: number;
  status: string;
  created_at: string;
}

const History = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
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

    fetchData();
  };

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const [transactionsResult, withdrawalsResult] = await Promise.all([
        supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("withdrawals")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false }),
      ]);

      if (transactionsResult.error) throw transactionsResult.error;
      if (withdrawalsResult.error) throw withdrawalsResult.error;

      setTransactions(transactionsResult.data || []);
      setWithdrawals(withdrawalsResult.data || []);
    } catch (error: any) {
      toast.error("Failed to load history");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-background dark:to-green-950">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <HistoryIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">
            Transaction History
          </h1>
        </div>

        <Tabs defaultValue="deposits" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          </TabsList>

          <TabsContent value="deposits" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Waste Deposits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-semibold">
                          Waste Deposit {transaction.is_valid ? '✓' : '✗'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.created_at), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Weight: {transaction.weight_kg} kg
                        </p>
                        {!transaction.is_valid && (
                          <p className="text-xs text-red-500 mt-1">
                            Below minimum weight (0.1kg)
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          +{transaction.points_earned}
                        </p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}

                  {transactions.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No deposits yet. Start recycling to earn points!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Withdrawal Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {withdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-semibold">
                          ₦{withdrawal.amount_naira.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(withdrawal.created_at), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Points: {withdrawal.points_deducted}
                        </p>
                      </div>
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
                    </div>
                  ))}

                  {withdrawals.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No withdrawal requests yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default History;
