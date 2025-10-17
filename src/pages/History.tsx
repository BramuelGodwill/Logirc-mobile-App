import { Search, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();

  const mockHistory = [
    {
      id: 1,
      query: "What is quantum computing?",
      preview: "Quantum computing uses quantum mechanics principles...",
      timestamp: "2 hours ago",
      isFavorite: true,
    },
    {
      id: 2,
      query: "Weather in Nairobi",
      preview: "Current weather in Nairobi is sunny with...",
      timestamp: "5 hours ago",
      isFavorite: false,
    },
    {
      id: 3,
      query: "Translate hello to Swahili",
      preview: "Hello in Swahili is 'Jambo' or 'Habari'...",
      timestamp: "Yesterday",
      isFavorite: false,
    },
  ];

  return (
    <Layout>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Search History</h1>

        {/* Search Filter */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            className="pl-10 h-12"
          />
        </div>

        {/* History List */}
        <div className="space-y-3">
          {mockHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
              onClick={() => navigate(`/results?q=${encodeURIComponent(item.query)}`)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium line-clamp-1 flex-1">
                  {item.query}
                </h3>
                <div className="flex gap-2 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        item.isFavorite ? "fill-accent text-accent" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {item.preview}
              </p>
              <p className="text-xs text-muted-foreground">{item.timestamp}</p>
            </div>
          ))}
        </div>

        {/* Clear History Button */}
        <Button
          variant="outline"
          className="w-full mt-6"
          onClick={() => {}}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All History
        </Button>
      </div>
    </Layout>
  );
};

export default History;