import { ArrowLeft, Check, Crown, Smartphone, CreditCard, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Premium = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [transactionCode, setTransactionCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      searches: 15,
      duration: "Forever",
      features: ["Basic AI search", "15 queries per day", "Standard response time", "Limited voice search"]
    },
    {
      id: "pro",
      name: "Pro",
      price: 3,
      searches: 300,
      duration: "30 days",
      features: ["Advanced AI reasoning", "300 queries per day", "Priority response time", "Full voice search", "Image analysis", "Real-time data access"]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 10,
      searches: -1,
      duration: "30 days",
      features: ["Everything in Pro", "Unlimited queries", "Priority support", "Download conversations", "Ad-free experience", "API access"]
    }
  ];

  const paymentMethods = [
    {
      icon: Smartphone,
      name: "M-Pesa",
      details: "+254793776178",
      instructions: "Send to this number, then enter transaction code below"
    },
    {
      icon: CreditCard,
      name: "PayPal",
      details: "BRAMUELGODWILL7@GMAIL.COM",
      instructions: "Send payment, then enter PayPal transaction ID"
    },
    {
      icon: Building2,
      name: "Bank Transfer",
      details: "Business No. 247247, Account 0480185718502",
      instructions: "Transfer to account, then enter reference code"
    }
  ];

  const handleVerifyPayment = async () => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/auth");
      return;
    }

    if (!selectedPlan || !transactionCode) {
      toast.error("Please select a plan and enter transaction code");
      return;
    }

    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan || plan.id === "free") return;

    setIsVerifying(true);

    try {
      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          plan_id: selectedPlan,
          amount: plan.price,
          payment_method: "manual",
          transaction_code: transactionCode,
          status: "pending"
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Call verify-payment edge function
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: {
          transactionId: transaction.id,
          code: verificationCode || undefined
        }
      });

      if (error) throw error;

      toast.success("Payment verified! Your plan has been upgraded.");
      navigate("/subscription");
    } catch (error: any) {
      console.error("Payment verification error:", error);
      toast.error(error.message || "Failed to verify payment");
    } finally {
      setIsVerifying(false);
    }
  };

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
          <h1 className="text-xl font-bold">Choose Your Plan</h1>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 cursor-pointer transition-all ${
                selectedPlan === plan.id ? "border-primary ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.id === "enterprise" && <Crown className="h-8 w-8 text-primary mb-2" />}
              <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium">
                  {plan.searches === -1 ? "Unlimited" : plan.searches} searches/day
                </p>
                <p className="text-xs text-muted-foreground">{plan.duration}</p>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {selectedPlan && selectedPlan !== "free" && (
          <>
            {/* Payment Methods */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <Card key={method.name} className="p-4">
                    <method.icon className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold mb-1">{method.name}</h3>
                    <p className="text-sm font-mono mb-2">{method.details}</p>
                    <p className="text-xs text-muted-foreground">{method.instructions}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Verification Form */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Verify Payment</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="transaction-code">Transaction Code / Reference</Label>
                  <Input
                    id="transaction-code"
                    placeholder="Enter M-Pesa code, PayPal ID, or bank reference"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="verification-code">
                    Verification Code (Optional)
                  </Label>
                  <Input
                    id="verification-code"
                    placeholder="If you received a verification code, enter it here"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleVerifyPayment}
                  disabled={isVerifying || !transactionCode}
                >
                  {isVerifying ? "Verifying..." : "Verify Payment"}
                </Button>
              </div>
            </Card>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Questions? Contact support for assistance
        </p>

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

export default Premium;
