import { ArrowLeft, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";

const Premium = () => {
  const navigate = useNavigate();

  const freeFeatures = [
    "Basic AI search",
    "10 queries per day",
    "Standard response time",
    "Limited voice search",
  ];

  const premiumFeatures = [
    "Advanced AI reasoning",
    "Unlimited queries",
    "Priority response time",
    "Full voice search",
    "Image analysis",
    "Real-time data access",
    "Download conversations",
    "Ad-free experience",
    "Priority support",
  ];

  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Upgrade to Premium</h1>
        </div>

        {/* Premium Hero */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary to-primary-glow text-white">
          <Crown className="h-12 w-12 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Logirc AI Premium</h2>
          <p className="text-white/90 mb-4">
            Unlock the full power of AI-driven search and reasoning
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">$9.99</span>
            <span className="text-white/80">/month</span>
          </div>
        </Card>

        {/* Feature Comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-muted-foreground">Free Plan</h3>
            <ul className="space-y-3">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 border-primary">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Premium</h3>
            </div>
            <ul className="space-y-3">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* CTA */}
        <Button className="w-full h-14 text-lg" size="lg">
          <Crown className="h-5 w-5 mr-2" />
          Subscribe Now
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          7-day money-back guarantee • Cancel anytime
        </p>
      </div>
    </Layout>
  );
};

export default Premium;