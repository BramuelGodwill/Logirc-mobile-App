import { useEffect, useState } from "react";
import { Search, Star, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";

interface SearchHistory {
  id: string;
  query: string;
  answer: string;
  created_at: string;
  is_favorite: boolean;
}

const History = () => {
  const [searches, setSearches] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('searches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSearches(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Error",
        description: "Failed to load search history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('searches')
        .update({ is_favorite: !currentValue })
        .eq('id', id);

      if (error) throw error;

      setSearches(searches.map(s => 
        s.id === id ? { ...s, is_favorite: !currentValue } : s
      ));

      toast({
        title: !currentValue ? "Added to favorites" : "Removed from favorites",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };

  const deleteSearch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('searches')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSearches(searches.filter(s => s.id !== id));

      toast({
        title: "Deleted",
        description: "Search removed from history.",
      });
    } catch (error) {
      console.error('Error deleting search:', error);
      toast({
        title: "Error",
        description: "Failed to delete search.",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const filteredSearches = searches.filter(s => 
    s.query.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Search History</h1>

        {/* Search Filter */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search history..."
            className="pl-10 h-12"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        {/* Search History */}
        <div className="space-y-3">
          {filteredSearches.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {searchFilter ? 'No searches found' : 'No search history yet'}
              </p>
            </Card>
          ) : (
            filteredSearches.map((search) => (
              <Card 
                key={search.id} 
                className="p-4 cursor-pointer hover:border-primary transition-colors"
                onClick={() => navigate(`/results?id=${search.id}`)}
              >
                <div className="flex items-start gap-3">
                  <Search className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 line-clamp-1">{search.query}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {search.answer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(search.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(search.id, search.is_favorite);
                      }}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          search.is_favorite
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSearch(search.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default History;