import { Settings, Crown, Database, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ThemeToggle";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [lowDataMode, setLowDataMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <Layout>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        {/* User Info Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">U</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">User</h2>
              <p className="text-sm text-muted-foreground">Free Plan</p>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => navigate("/premium")}
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        </Card>

        {/* Settings */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-muted-foreground">Settings</h3>

          <Card className="divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <span className="font-medium">Dark Mode</span>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Low Data Mode</span>
              </div>
              <Switch
                checked={lowDataMode}
                onCheckedChange={setLowDataMode}
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Notifications</span>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <button
              className="flex items-center gap-3 p-4 w-full hover:bg-muted/50 transition-colors"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">More Settings</span>
            </button>
          </Card>
        </div>

        {/* Data Usage Stats */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">Usage Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-primary">127</p>
              <p className="text-sm text-muted-foreground">Queries</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">45</p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {}}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </Layout>
  );
};

export default Profile;