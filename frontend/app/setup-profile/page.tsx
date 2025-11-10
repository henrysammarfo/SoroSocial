"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function SetupProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const wallet = useStore((state) => state.wallet)
  const needsProfileSetup = useStore((state) => state.needsProfileSetup)
  const isAuthenticated = useStore((state) => state.isAuthenticated)
  const initializeUser = useStore((state) => state.initializeUser)

  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!wallet.connected) {
      router.push("/")
      return
    }

    if (isAuthenticated && !needsProfileSetup) {
      router.push("/app")
    }
  }, [wallet.connected, needsProfileSetup, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formattedUsername = username.startsWith("@") ? username : `@${username}`
      initializeUser(wallet.address!, formattedUsername, bio)

      toast({
        title: "Profile created",
        description: "Welcome to TradeSocial!",
      })

      router.push("/app")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup Your Profile</CardTitle>
          <CardDescription>Complete your profile to start trading</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="@yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Profile..." : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
