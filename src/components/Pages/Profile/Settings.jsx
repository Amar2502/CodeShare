import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Globe, Bell, Shield, Palette, Monitor } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { app } from "@/firebase";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(app);

const Settings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    theme: "system",
    notifications: true,
    emailNotifications: true,
    autoSave: true,
    language: "english",
    fontSize: "medium",
    lineNumbers: true,
    privacy: {
      shareData: false,
      publicProfile: true,
    },
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]:
        typeof prev[category] === "object"
          ? { ...prev[category], [setting]: value }
          : value,
    }));
  };

  const handleLogOut = async () => {
    await signOut(auth)
      .then(() => {
        console.log("success");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="h-full w-full flex justify-center items-center bg-gray-300">
      <div className="w-full max-w-4xl mx-auto p-4 space-y-6 rounded-2xl">
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4 bg-gray-200">
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-white"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="editor"
              className="data-[state=active]:bg-white"
            >
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-white"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="data-[state=active]:bg-white"
            >
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription className="text-gray-600">
                  Customize how your workspace looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Theme</Label>
                      <div className="text-sm text-gray-500">
                        Select your preferred theme
                      </div>
                    </div>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) =>
                        handleSettingChange("theme", null, value)
                      }
                    >
                      <SelectTrigger className="w-40 bg-gray-50 border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun size={16} />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon size={16} />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor size={16} />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Language</Label>
                      <div className="text-sm text-gray-500">
                        Choose your preferred language
                      </div>
                    </div>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        handleSettingChange("language", null, value)
                      }
                    >
                      <SelectTrigger className="w-40 bg-gray-50 border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Editor Settings */}
          <TabsContent value="editor">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Editor Settings</CardTitle>
                <CardDescription className="text-gray-600">
                  Customize your coding environment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Font Size</Label>
                      <div className="text-sm text-gray-500">
                        Choose your preferred font size
                      </div>
                    </div>
                    <Select
                      value={settings.fontSize}
                      onValueChange={(value) =>
                        handleSettingChange("fontSize", null, value)
                      }
                    >
                      <SelectTrigger className="w-40 bg-gray-50 border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Line Numbers</Label>
                      <div className="text-sm text-gray-500">
                        Show line numbers in editor
                      </div>
                    </div>
                    <Switch
                      checked={settings.lineNumbers}
                      onCheckedChange={(checked) =>
                        handleSettingChange("lineNumbers", null, checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto Save</Label>
                      <div className="text-sm text-gray-500">
                        Automatically save your changes
                      </div>
                    </div>
                    <Switch
                      checked={settings.autoSave}
                      onCheckedChange={(checked) =>
                        handleSettingChange("autoSave", null, checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Push Notifications</Label>
                      <div className="text-sm text-gray-500">
                        Receive push notifications
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("notifications", null, checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <div className="text-sm text-gray-500">
                        Receive email notifications
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("emailNotifications", null, checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your privacy preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Public Profile</Label>
                      <div className="text-sm text-gray-500">
                        Make your profile visible to others
                      </div>
                    </div>
                    <Switch
                      checked={settings.privacy.publicProfile}
                      onCheckedChange={(checked) =>
                        handleSettingChange("privacy", "publicProfile", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Share Usage Data</Label>
                      <div className="text-sm text-gray-500">
                        Help us improve by sharing anonymous usage data
                      </div>
                    </div>
                    <Switch
                      checked={settings.privacy.shareData}
                      onCheckedChange={(checked) =>
                        handleSettingChange("privacy", "shareData", checked)
                      }
                    />
                    <Button onClick={handleLogOut}>LogOut</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
