import { ArrowLeft, Users, DollarSign, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalyticsData {
  activeUsers: number;
  totalSearches: number;
  totalPayments: number;
  totalRevenue: number;
  paymentsByPlan: { plan: string; count: number; revenue: number }[];
  topUsers: { email: string; searches: number }[];
}

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    activeUsers: 0,
    totalSearches: 0,
    totalPayments: 0,
    totalRevenue: 0,
    paymentsByPlan: [],
    topUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    try {
      // Active users (profiles created in last 30 days)
      const { count: activeUsersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Total searches
      const { count: totalSearchesCount } = await supabase
        .from("searches")
        .select("*", { count: "exact", head: true });

      // Payments
      const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("status", "verified");

      const totalPayments = transactions?.length || 0;
      const totalRevenue = transactions?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;

      // Payments by plan
      const paymentsByPlan: { [key: string]: { count: number; revenue: number } } = {};
      transactions?.forEach((tx) => {
        const planId = tx.plan_id || "unknown";
        if (!paymentsByPlan[planId]) {
          paymentsByPlan[planId] = { count: 0, revenue: 0 };
        }
        paymentsByPlan[planId].count++;
        paymentsByPlan[planId].revenue += Number(tx.amount);
      });

      // Top users by searches
      const { data: profiles } = await supabase
        .from("profiles")
        .select("email, daily_searches_used")
        .order("daily_searches_used", { ascending: false })
        .limit(10);

      setData({
        activeUsers: activeUsersCount || 0,
        totalSearches: totalSearchesCount || 0,
        totalPayments,
        totalRevenue,
        paymentsByPlan: Object.entries(paymentsByPlan).map(([plan, stats]) => ({
          plan,
          ...stats
        })),
        topUsers: profiles?.map(p => ({
          email: p.email || "Unknown",
          searches: p.daily_searches_used || 0
        })) || []
      });
    } catch (error: any) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="px-4 py-6 text-center">Loading analytics...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Analytics Dashboard</h1>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold">{data.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Searches</p>
                <p className="text-3xl font-bold">{data.totalSearches}</p>
              </div>
              <Search className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payments</p>
                <p className="text-3xl font-bold">{data.totalPayments}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-3xl font-bold">${data.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Payments by Plan */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Payments by Plan</h2>
            {data.paymentsByPlan.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No payment data yet</p>
            ) : (
              <div className="space-y-3">
                {data.paymentsByPlan.map((item) => (
                  <div key={item.plan} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{item.plan}</p>
                      <p className="text-sm text-muted-foreground">{item.count} payments</p>
                    </div>
                    <p className="font-bold">${item.revenue.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Top Users */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Top Users by Searches</h2>
            {data.topUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No user data yet</p>
            ) : (
              <div className="space-y-3">
                {data.topUsers.map((user, idx) => (
                  <div key={user.email} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-muted-foreground">#{idx + 1}</span>
                      <p className="font-medium truncate">{user.email}</p>
                    </div>
                    <p className="font-bold">{user.searches} searches</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

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

export default Analytics;
