import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

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
            <h1 className="text-lg font-semibold line-clamp-1">{query}</h1>
          </div>
        </div>

        {/* AI Answer Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-semibold">AI Answer</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground">
              This is where the AI-generated answer will appear. The system will
              process your query and provide a comprehensive, direct answer based
              on real-time web results and advanced reasoning capabilities.
            </p>
          </div>
        </Card>

        {/* Follow-up Questions */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Follow-up questions</h3>
          <div className="flex flex-col gap-2">
            {[
              "Can you explain that in simpler terms?",
              "What are the latest updates?",
              "How does this compare to alternatives?",
            ].map((question) => (
              <Button
                key={question}
                variant="outline"
                className="justify-start h-auto py-3 px-4 text-left"
                onClick={() => navigate(`/results?q=${encodeURIComponent(question)}`)}
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
            {[1, 2, 3].map((i) => (
              <a
                key={i}
                href="#"
                className="block p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <p className="text-sm font-medium">Source {i}</p>
                <p className="text-xs text-muted-foreground">example.com</p>
              </a>
            ))}
          </div>
        </details>
      </div>
    </Layout>
  );
};

export default Results;