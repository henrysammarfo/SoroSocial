"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Settings, Share2, Camera, Copy } from "lucide-react"
import { useState } from "react"
import { useStore } from "@/lib/store"
import type { Trader } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CopyTradeConfig } from "@/components/copy-trade-config"
import { CopyTradeConfirmation } from "@/components/copy-trade-confirmation"

interface ProfileHeaderProps {
  trader: Trader | null
  onUpdate?: () => void
  isOwnProfile?: boolean
}

export function ProfileHeader({ trader, onUpdate, isOwnProfile = false }: ProfileHeaderProps) {
  const followTrader = useStore((state) => state.followTrader)
  const unfollowTrader = useStore((state) => state.unfollowTrader)
  const isFollowingTrader = useStore((state) => state.isFollowing)
  const updateUserProfile = useStore((state) => state.updateUserProfile)
  const startCopyTrading = useStore((state) => state.startCopyTrading)
  const wallet = useStore((state) => state.wallet)

  const [isFollowing, setIsFollowing] = useState(trader ? isFollowingTrader(trader.id) : false)
  const [isLoading, setIsLoading] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showCopyDialog, setShowCopyDialog] = useState(false)
  const [copyStep, setCopyStep] = useState<"config" | "confirm">("config")
  const [copyConfig, setCopyConfig] = useState<any>(null)
  const [editUsername, setEditUsername] = useState(trader?.username || "")
  const [editBio, setEditBio] = useState(trader?.bio || "")
  const [editAvatar, setEditAvatar] = useState(trader?.avatar || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const { toast } = useToast()

  if (!trader) {
    return null
  }

  const handleFollowClick = async () => {
    setIsLoading(true)

    if (isFollowing) {
      unfollowTrader(trader.id)
      setIsFollowing(false)
      toast({
        title: "Unfollowed",
        description: `You are no longer following ${trader.displayName}`,
      })
    } else {
      followTrader(trader.id)
      setIsFollowing(true)
      toast({
        title: "Following",
        description: `You are now following ${trader.displayName}`,
      })
    }

    onUpdate?.()
    setIsLoading(false)
  }

  const handleCopyClick = () => {
    setShowCopyDialog(true)
    setCopyStep("config")
    setCopyConfig(null)
  }

  const handleConfigComplete = (configuration: any) => {
    setCopyConfig(configuration)
    setCopyStep("confirm")
  }

  const handleConfirm = () => {
    if (!copyConfig) return

    const amount = Number.parseFloat(copyConfig.investmentAmount)

    if (amount > wallet.balance) {
      toast({
        title: "Insufficient balance",
        description: `You need ${amount.toLocaleString()} XLM but only have ${wallet.balance.toLocaleString()} XLM`,
        variant: "destructive",
      })
      return
    }

    const config = {
      trader: trader,
      amount,
      copyRatio: copyConfig.copyRatio,
      stopLoss: Number.parseFloat(copyConfig.stopLoss) || 0,
      takeProfit: Number.parseFloat(copyConfig.takeProfit) || 0,
      maxPerTrade: copyConfig.maxPerTrade ? Number.parseFloat(copyConfig.maxPerTrade) : amount,
      active: true,
      paused: false,
      totalProfit: 0,
      startDate: new Date().toISOString(),
    }

    startCopyTrading(config)
    setShowCopyDialog(false)

    toast({
      title: "Copy trading activated",
      description: `Now copying ${trader.displayName}'s trades`,
    })
  }

  const handleEditProfile = () => {
    if (!editUsername.trim()) {
      toast({
        title: "Username required",
        variant: "destructive",
      })
      return
    }

    const formattedUsername = editUsername.startsWith("@") ? editUsername : `@${editUsername}`
    let avatarUrl = editAvatar
    if (avatarFile) {
      avatarUrl = URL.createObjectURL(avatarFile)
    }

    updateUserProfile(formattedUsername, editBio, avatarUrl)
    setShowEditDialog(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    })
    onUpdate?.()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditAvatar(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${trader.displayName} - Top Trader`,
        text: `Check out ${trader.displayName} on TradeSocial!`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Profile link copied to clipboard",
      })
    }
  }

  return (
    <>
      <div className="border-b border-border bg-card p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
                        <Avatar className="h-20 w-20 md:h-24 md:w-24">
              <AvatarImage src={trader.avatar || "/placeholder.svg"} alt={trader.displayName} />
              <AvatarFallback>{(trader.displayName || "U")[0]}</AvatarFallback>
            </Avatar></search>
</search_and_replace>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{trader.displayName}</h1>
                {trader.verified && <CheckCircle2 className="h-5 w-5 fill-primary text-primary-foreground" />}
              </div>
              <p className="text-sm text-muted-foreground">{trader.username}</p>
              <div className="flex flex-wrap gap-2">
                {trader.totalReturn > 100 && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Top Trader
                  </Badge>
                )}
                {trader.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            {isOwnProfile ? (
              <Button onClick={() => setShowEditDialog(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleFollowClick} disabled={isLoading}>
                  {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
                </Button>
                <Button onClick={handleCopyClick}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Trader
                </Button>
              </>
            )}
          </div>
        </div>

        {trader.bio && <p className="mt-4 text-sm text-foreground max-w-2xl">{trader.bio}</p>}

        <div className="mt-6 flex gap-6 text-sm">
          <div>
            <span className="font-semibold">{trader.followers.toLocaleString()}</span>{" "}
            <span className="text-muted-foreground">Followers</span>
          </div>
          <div>
            <span className="font-semibold">{trader.copiers.toLocaleString()}</span>{" "}
            <span className="text-muted-foreground">Copiers</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={editAvatar || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback>{editUsername[0] || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById("avatar-upload")?.click()}>
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEditProfile} className="flex-1">
                Save Changes
              </Button>
              <Button onClick={() => setShowEditDialog(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{copyStep === "config" ? "Configure Copy Trading" : "Confirm Copy Trade"}</DialogTitle>
          </DialogHeader>
          {copyStep === "config" ? (
            <CopyTradeConfig trader={trader} onComplete={handleConfigComplete} />
          ) : (
            <CopyTradeConfirmation trader={trader} config={copyConfig} onConfirm={handleConfirm} />
          )}
          {copyStep === "confirm" && (
            <Button variant="outline" onClick={() => setCopyStep("config")} className="mt-4">
              Back to Configuration
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
