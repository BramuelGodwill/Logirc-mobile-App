import { useState } from "react";
import { Search, Mic, Image, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickActions = [
    { label: "Weather", icon: "🌤️" },
    { label: "News", icon: "📰" },
    { label: "Translate", icon: "🌐" },
  ];

  const suggestedQueries = [
    "What's the weather today?",
    "Latest tech news",
    "Translate hello to Swahili",
    "Explain quantum computing",
  ];

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Logirc AI
            </h1>
          </div>
          <p className="text-muted-foreground">
            Get instant answers, not just links
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Ask anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-24 h-14 text-base rounded-full border-2 focus:border-primary"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={() => navigate("/voice")}
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={() => navigate("/image")}
              >
                <Image className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="rounded-full"
              onClick={() => setSearchQuery(action.label)}
            >
              <span className="mr-2">{action.icon}</span>
              {action.label}
            </Button>
          ))}
        </div>

        {/* Suggested Queries */}
        <div className="w-full max-w-2xl">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Suggested queries
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQueries.map((query) => (
              <button
                key={query}
                onClick={() => setSearchQuery(query)}
                className="text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <p className="text-sm">{query}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;