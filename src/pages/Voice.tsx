import { useState } from "react";
import { Mic, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const Voice = () => {
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <Layout showBottomNav={false}>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold mb-2">Voice Search</h1>
          <p className="text-muted-foreground">
            {isListening ? "Listening..." : "Tap the microphone to start"}
          </p>
        </div>

        {/* Microphone Visualization */}
        <div className="relative mb-12">
          <button
            onClick={toggleListening}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? "bg-accent animate-pulse"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            <Mic className="h-16 w-16 text-white" />
          </button>
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-accent animate-ping" />
          )}
        </div>

        {/* Voice Command Tips */}
        <div className="w-full max-w-md space-y-3 mb-8">
          <p className="text-sm text-muted-foreground text-center mb-4">
            Try saying:
          </p>
          {[
            "What's the weather like today?",
            "Tell me about artificial intelligence",
            "Translate hello to Swahili",
          ].map((tip) => (
            <div
              key={tip}
              className="p-3 rounded-lg bg-muted/50 text-center text-sm"
            >
              "{tip}"
            </div>
          ))}
        </div>

        {/* Cancel Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="rounded-full"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </Layout>
  );
};

export default Voice;