import { ArrowLeft, Calendar, CreditCard, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ManageSubscription = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      // Load transactions
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (txError) throw txError;
      setTransactions(txData || []);

      await refreshProfile();
    } catch (error: any) {
      console.error("Error loading subscription data:", error);
      toast.error("Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  };

  const planType = profile?.plan_type || "free";
  const expiresAt = profile?.plan_expires_at ? new Date(profile.plan_expires_at) : null;
  const daysRemaining = expiresAt ? Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const searchesUsed = profile?.daily_searches_used || 0;
  const searchesLimit = profile?.daily_searches_limit || 15;
  const searchesPercentage = searchesLimit === -1 ? 0 : (searchesUsed / searchesLimit) * 100;

  if (loading) {
    return (
      <Layout>
        <div className="px-4 py-6 text-center">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Manage Subscription</h1>
        </div>

        {/* Current Plan */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold capitalize">{planType} Plan</h2>
              <p className="text-muted-foreground">
                {planType === "free" ? "Upgrade to unlock more features" : "Active subscription"}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-primary" />
          </div>

          {expiresAt && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Calendar className="h-4 w-4" />
              <span>
                {daysRemaining && daysRemaining > 0
                  ? `Expires in ${daysRemaining} days (${expiresAt.toLocaleDateString()})`
                  : "Expired"}
              </span>
            </div>
          )}

          {/* Usage Stats */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Daily Searches</span>
              <span className="text-sm text-muted-foreground">
                {searchesUsed} / {searchesLimit === -1 ? "∞" : searchesLimit}
              </span>
            </div>
            {searchesLimit !== -1 && (
              <Progress value={searchesPercentage} className="h-2" />
            )}
          </div>

          <Button
            className="w-full mt-6"
            onClick={() => navigate("/premium")}
            variant={planType === "free" ? "default" : "outline"}
          >
            {planType === "free" ? "Upgrade Plan" : "Change Plan"}
          </Button>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
          </div>

          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium capitalize">{tx.payment_method}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                    {tx.transaction_code && (
                      <p className="text-xs font-mono mt-1">{tx.transaction_code}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${tx.amount}</p>
                    <p
                      className={`text-xs ${
                        tx.status === "verified"
                          ? "text-green-600"
                          : tx.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Developer Credit */}
        <div className="text-xs text-muted-foreground mt-8 text-center">
          Version 1.0.0
          <span
            onDoubleClick={() => toast.info("Developer: Bramuel Godwill")}
            className="cursor-pointer select-none ml-2"
          >
            ⓘ
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default ManageSubscription;
