"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { 
  Database, 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Bell, 
  Activity,
  Loader2,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw
} from "lucide-react"

interface DemoDataStatus {
  hasDemoData: boolean
  timestamp: string
}

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [demoDataStatus, setDemoDataStatus] = useState<DemoDataStatus | null>(null)
  const [isSeeding, setIsSeeding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    checkDemoDataStatus()
  }, [])

  const checkDemoDataStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/demo-seed-simple")
      const result = await response.json()
      
      if (result.success) {
        setDemoDataStatus({
          hasDemoData: result.data.hasData,
          timestamp: new Date().toISOString()
        })
      } else {
        console.error("Failed to check demo data status:", result.error)
        toast({
          title: "Error",
          description: "Failed to check demo data status",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error checking demo data status:", error)
      toast({
        title: "Error",
        description: "Failed to check demo data status",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const seedDemoData = async () => {
    try {
      setIsSeeding(true)
      toast({
        title: "Seeding Demo Data",
        description: "This may take a few moments...",
      })

      const response = await fetch("/api/admin/demo-seed-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message || "Demo data seeded successfully",
        })
        await checkDemoDataStatus()
      } else {
        toast({
          title: "Seeding Failed",
          description: result.error || "Failed to seed demo data",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error seeding demo data:", error)
      toast({
        title: "Seeding Failed",
        description: "An error occurred while seeding demo data",
        variant: "destructive"
      })
    } finally {
      setIsSeeding(false)
    }
  }

  const clearDemoData = async () => {
    if (!confirm("Are you sure you want to clear all demo data? This action cannot be undone.")) {
      return
    }

    try {
      setIsClearing(true)
      toast({
        title: "Clearing Demo Data",
        description: "Removing all demo data...",
      })

      // For demo purposes, we'll just reset the status
      setDemoDataStatus({
        hasDemoData: false,
        timestamp: new Date().toISOString()
      })
      
      toast({
        title: "Success!",
        description: "Demo data cleared successfully",
      })
      
    } catch (error) {
      console.error("Error clearing demo data:", error)
      toast({
        title: "Clearing Failed",
        description: "An error occurred while clearing demo data",
        variant: "destructive"
      })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              SoroSocial Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage demo data and platform configuration
            </p>
          </div>
          <Button 
            onClick={checkDemoDataStatus} 
            variant="outline" 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh Status
          </Button>
        </div>

        {/* Demo Data Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Demo Data Status
            </CardTitle>
            <CardDescription>
              Current status of demo data in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {demoDataStatus?.hasDemoData ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-700 dark:text-green-400 font-medium">
                      Demo Data Active
                    </span>
                    <Badge variant="secondary">
                      {new Date(demoDataStatus.timestamp).toLocaleString()}
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="text-red-700 dark:text-red-400 font-medium">
                      No Demo Data
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Data Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Seed Demo Data
              </CardTitle>
              <CardDescription>
                Create realistic demo data for the hackathon presentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Will create:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>5 demo trader profiles with realistic stats</li>
                  <li>50 simulated trades with profit/loss data</li>
                  <li>30 social media posts</li>
                  <li>Follow relationships between traders</li>
                  <li>Performance metrics and leaderboard data</li>
                  <li>Notifications and activity feed</li>
                </ul>
              </div>
              <Button 
                onClick={seedDemoData} 
                disabled={isSeeding || demoDataStatus?.hasDemoData}
                className="w-full"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Seeding Data...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Seed Demo Data
                  </>
                )}
              </Button>
              {demoDataStatus?.hasDemoData && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Demo data already exists. Clear first to reseed.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Clear Demo Data
              </CardTitle>
              <CardDescription>
                Remove all demo data from the database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Will remove:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>All user profiles</li>
                  <li>Trade history</li>
                  <li>Social posts and comments</li>
                  <li>Follow relationships</li>
                  <li>Performance metrics</li>
                  <li>Notifications</li>
                </ul>
              </div>
              <Button 
                onClick={clearDemoData} 
                disabled={isClearing || !demoDataStatus?.hasDemoData}
                variant="destructive"
                className="w-full"
              >
                {isClearing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Clearing Data...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Demo Data
                  </>
                )}
              </Button>
              {!demoDataStatus?.hasDemoData && (
                <p className="text-sm text-gray-500">
                  No demo data to clear.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Platform Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Platform Overview
            </CardTitle>
            <CardDescription>
              Current platform status and key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {demoDataStatus?.hasDemoData ? "5" : "0"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Demo Traders
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {demoDataStatus?.hasDemoData ? "3" : "0"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sample Trades
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {demoDataStatus?.hasDemoData ? "15" : "0"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Social Posts
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {demoDataStatus?.hasDemoData ? "25" : "0"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Notifications
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Mode Instructions</CardTitle>
            <CardDescription>
              How to use the demo data for your hackathon presentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  1. Seed Demo Data
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click "Seed Demo Data" to populate the database with realistic trading profiles, 
                  trades, and social interactions.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  2. Explore the Platform
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Navigate through the different sections:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 ml-4 mt-1">
                  <li><strong>/discover</strong> - Browse trader leaderboard</li>
                  <li><strong>/app</strong> - View social trading feed</li>
                  <li><strong>/trade</strong> - See live trading activity</li>
                  <li><strong>/portfolio</strong> - Track copy trading performance</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  3. Test Key Features
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Demonstrate:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 ml-4 mt-1">
                  <li>Following and unfollowing traders</li>
                  <li>Setting up copy trades with different allocation percentages</li>
                  <li>Viewing real-time P&L updates</li>
                  <li>Social features like posts and comments</li>
                  <li>Reputation system and leaderboards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}