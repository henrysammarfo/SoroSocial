"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

interface LeaderboardFiltersProps {
  onFilterChange?: (filters: FilterState) => void
}

export interface FilterState {
  search: string
  timeframe: string
  risk: string
  category: string
  sortBy: string
}

export function LeaderboardFilters({ onFilterChange }: LeaderboardFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    timeframe: "1y",
    risk: "all",
    category: "all",
    sortBy: "return",
  })

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      search: "",
      timeframe: "1y",
      risk: "all",
      category: "all",
      sortBy: "return",
    }
    setFilters(defaultFilters)
    onFilterChange?.(defaultFilters)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Filters & Sorting</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search traders..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeframe">Timeframe</Label>
          <Select value={filters.timeframe} onValueChange={(value) => updateFilter("timeframe", value)}>
            <SelectTrigger id="timeframe">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="risk">Risk Level</Label>
          <Select value={filters.risk} onValueChange={(value) => updateFilter("risk", value)}>
            <SelectTrigger id="risk">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="low">Low Risk (1-3)</SelectItem>
              <SelectItem value="medium">Medium Risk (4-6)</SelectItem>
              <SelectItem value="high">High Risk (7-10)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tech">Tech Stocks</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="forex">Forex</SelectItem>
              <SelectItem value="commodities">Commodities</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortBy">Sort By</Label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
            <SelectTrigger id="sortBy">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="return">Highest Return</SelectItem>
              <SelectItem value="winRate">Win Rate</SelectItem>
              <SelectItem value="copiers">Most Copiers</SelectItem>
              <SelectItem value="volume">Trading Volume</SelectItem>
              <SelectItem value="followers">Most Followers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </Card>
  )
}
