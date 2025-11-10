"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Bell, Eye, Shield, Trash2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/protected-route"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"

function SettingsPageContent() {
  const { toast } = useToast()
  const router = useRouter()
  const user = useStore((state) => state.user)
  const disconnectWallet = useStore((state) => state.disconnectWallet)

  const [notifications, setNotifications] = useState({
    trades: true,
    followers: true,
    comments: true,
    marketing: false,
  })

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showBalance: false,
    showTrades: true,
  })

  const handleSaveNotifications = () => {
    toast({
      title: "Saved",
      description: "Your notification preferences have been updated",
    })
  }

  const handleSavePrivacy = () => {
    toast({
      title: "Saved",
      description: "Your privacy settings have been updated",
    })
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      disconnectWallet()
      router.push("/")
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Choose what updates you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Trade Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified when traders you copy make trades</p>
            </div>
            <Switch
              checked={notifications.trades}
              onCheckedChange={(checked) => setNotifications({ ...notifications, trades: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Followers</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone follows you</p>
            </div>
            <Switch
              checked={notifications.followers}
              onCheckedChange={(checked) => setNotifications({ ...notifications, followers: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Comments & Mentions</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone comments or mentions you</p>
            </div>
            <Switch
              checked={notifications.comments}
              onCheckedChange={(checked) => setNotifications({ ...notifications, comments: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive tips, updates, and promotional content</p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
            />
          </div>
          <Button onClick={handleSaveNotifications} className="mt-4">
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy
          </CardTitle>
          <CardDescription>Control who can see your information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Profile</Label>
              <p className="text-sm text-muted-foreground">Allow anyone to view your profile and trading stats</p>
            </div>
            <Switch
              checked={privacy.profilePublic}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, profilePublic: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Wallet Balance</Label>
              <p className="text-sm text-muted-foreground">Display your wallet balance on your profile</p>
            </div>
            <Switch
              checked={privacy.showBalance}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, showBalance: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Trade History</Label>
              <p className="text-sm text-muted-foreground">Allow others to see your trading history</p>
            </div>
            <Switch
              checked={privacy.showTrades}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, showTrades: checked })}
            />
          </div>
          <Button onClick={handleSavePrivacy} className="mt-4">
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your wallet and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Wallet Address</Label>
            <Input value={user?.walletAddress || ""} disabled />
            <p className="text-sm text-muted-foreground">Your wallet is connected via Freighter</p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, all your data will be permanently removed. This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  )
}
