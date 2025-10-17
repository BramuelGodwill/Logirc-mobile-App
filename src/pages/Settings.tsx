import { ArrowLeft, Globe, Shield, HardDrive, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: "Language",
      icon: Globe,
      description: "English",
      action: () => {},
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      description: "Manage your privacy settings",
      action: () => {},
    },
    {
      title: "Data Management",
      icon: HardDrive,
      description: "Clear cache and data",
      action: () => {},
    },
    {
      title: "About",
      icon: Info,
      description: "Version 1.0.0",
      action: () => {},
    },
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
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        <Card className="divide-y divide-border">
          {settingsSections.map((section) => (
            <button
              key={section.title}
              className="flex items-center gap-4 p-4 w-full hover:bg-muted/50 transition-colors text-left"
              onClick={section.action}
            >
              <section.icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{section.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {section.description}
                </p>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
          ))}
        </Card>

        <div className="mt-6 space-y-4">
          <Button variant="outline" className="w-full">
            Terms of Service
          </Button>
          <Button variant="outline" className="w-full">
            Privacy Policy
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;