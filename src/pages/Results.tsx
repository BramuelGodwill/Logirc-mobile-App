import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Share2, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";

interface SearchResult {
  id: string;
  query: string;
  answer: string;
  sources: Array<{ title: string; url: string; domain: string }>;
  follow_up_questions: string[];
}

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const searchId = searchParams.get("id");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      if (!searchId) {
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('searches')
          .select('*')
          .eq('id', searchId)
          .single();

        if (error) throw error;
        
        setResult({
          ...data,
          sources: data.sources as Array<{ title: string; url: string; domain: string }>,
        });
      } catch (error) {
        console.error('Error fetching search result:', error);
        toast({
          title: "Error",
          description: "Failed to load search results.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [searchId, navigate, toast]);

  const handleCopy = () => {
    if (result?.answer) {
      navigator.clipboard.writeText(result.answer);
      toast({
        title: "Copied",
        description: "Answer copied to clipboard",
      });
    }
  };

  const handleShare = async () => {
    if (result) {
      try {
        await navigator.share({
          title: result.query,
          text: result.answer,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Layout>
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Search results for</p>
            <h1 className="text-lg font-semibold line-clamp-1">{result.query}</h1>
          </div>
        </div>

        {/* AI Answer Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-semibold">AI Answer</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground whitespace-pre-wrap">{result.answer}</p>
          </div>
        </Card>

        {/* Follow-up Questions */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Follow-up questions</h3>
          <div className="flex flex-col gap-2">
            {result.follow_up_questions.map((question) => (
              <Button
                key={question}
                variant="outline"
                className="justify-start h-auto py-3 px-4 text-left"
                onClick={() => navigate(`/?q=${encodeURIComponent(question)}`)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Sources */}
        <details className="group">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <span>Show sources</span>
              <span className="transition-transform group-open:rotate-180">▼</span>
            </div>
          </summary>
          <div className="mt-3 space-y-2">
            {result.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <p className="text-sm font-medium">{source.title}</p>
                <p className="text-xs text-muted-foreground">{source.domain}</p>
              </a>
            ))}
          </div>
        </details>
      </div>
    </Layout>
  );
};

export default Results;