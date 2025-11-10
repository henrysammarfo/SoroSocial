"use client"

import { useEffect, useState, useMemo } from "react"
import { LeaderboardFilters, type FilterState } from "@/components/leaderboard-filters"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { TrendingStrategies } from "@/components/trending-strategies"
import { useStore } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"
import { ProtectedRoute } from "@/components/protected-route"

function DiscoverPageContent() {
  const traders = useStore((state) => state.traders)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    timeframe: "1y",
    risk: "all",
    category: "all",
    sortBy: "return",
  })

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const filteredAndSortedTraders = useMemo(() => {
    let result = [...traders]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (t) =>
          t.displayName.toLowerCase().includes(searchLower) ||
          t.username.toLowerCase().includes(searchLower) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Apply risk filter
    if (filters.risk !== "all") {
      if (filters.risk === "low") {
        result = result.filter((t) => t.riskScore <= 3)
      } else if (filters.risk === "medium") {
        result = result.filter((t) => t.riskScore >= 4 && t.riskScore <= 6)
      } else if (filters.risk === "high") {
        result = result.filter((t) => t.riskScore >= 7)
      }
    }

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter((t) => t.tags?.includes(filters.category))
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "return":
        result.sort((a, b) => b.totalReturn - a.totalReturn)
        break
      case "winRate":
        result.sort((a, b) => b.winRate - a.winRate)
        break
      case "copiers":
        result.sort((a, b) => b.copiers - a.copiers)
        break
      case "volume":
        result.sort((a, b) => (b.stats?.totalVolume || 0) - (a.stats?.totalVolume || 0))
        break
      case "followers":
        result.sort((a, b) => b.followers - a.followers)
        break
      default:
        result.sort((a, b) => b.totalReturn - a.totalReturn)
    }

    return result.slice(0, 50)
  }, [traders, filters])

  const trendingTraders = useMemo(() => {
    return [...traders].sort((a, b) => b.copiers - a.copiers).slice(0, 10)
  }, [traders])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Discover Traders</h1>
        <p className="text-muted-foreground">Find and follow top-performing traders to copy their strategies</p>
      </div>

      <TrendingStrategies traders={trendingTraders} />
      <LeaderboardFilters onFilterChange={setFilters} />
      <LeaderboardTable traders={filteredAndSortedTraders} />
    </div>
  )
}

export default function DiscoverPage() {
  return (
    <ProtectedRoute>
      <DiscoverPageContent />
    </ProtectedRoute>
  )
}
