"use client"

import { useState, useEffect } from "react"

interface DemoUser {
  id: string
  address: string
  username: string
  bio: string
  reputation_score: number
  follower_count: number
  following_count: number
  verified: boolean
  avatar_url: string
}

interface DemoTrade {
  id: string
  trade_id: string
  trader_address: string
  token_in: string
  token_out: string
  amount_in: string
  amount_out: string
  min_amount_out: string
  pnl: string
  status: string
  timestamp: string
}

interface DemoData {
  users: DemoUser[]
  trades: DemoTrade[]
}

interface UseDemoDataReturn {
  demoData: DemoData | null
  isLoading: boolean
  error: string | null
  hasDemoData: boolean
}

export function useDemoData(): UseDemoDataReturn {
  const [demoData, setDemoData] = useState<DemoData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDemoData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/admin/demo-seed-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const result = await response.json()

      if (result.success) {
        setDemoData(result.data.demo_data)
      } else {
        setError(result.error || "Failed to load demo data")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDemoData()
  }, [])

  return {
    demoData,
    isLoading,
    error,
    hasDemoData: demoData !== null
  }
}