import { useState } from "react";
import { ChevronRight, Sparkles, Mic, Image, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      icon: Sparkles,
      title: "Welcome to Logirc AI",
      description:
        "Get instant answers, not just links. Experience intelligent search powered by advanced AI.",
    },
    {
      icon: Mic,
      title: "Voice Search",
      description:
        "Ask questions naturally with your voice. Logirc understands and responds instantly.",
    },
    {
      icon: Image,
      title: "Image Analysis",
      description:
        "Upload images and get detailed insights. AI-powered visual understanding at your fingertips.",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description:
        "Seamlessly switch between English and Swahili. Breaking language barriers with AI.",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/");
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip Button */}
      {currentSlide < slides.length - 1 && (
        <div className="flex justify-end p-4">
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-md text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <CurrentIcon className="w-16 h-16 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">
            {slides[currentSlide].title}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground text-lg mb-12">
            {slides[currentSlide].description}
          </p>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6">
        <Button
          className="w-full h-14 text-lg"
          size="lg"
          onClick={handleNext}
        >
          {currentSlide < slides.length - 1 ? (
            <>
              Next
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            "Get Started"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;