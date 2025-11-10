"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Search, Filter, Copy } from "lucide-react"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function TradePageContent() {
  const allTrades = useStore((state) => state.trades)
  const [search, setSearch] = useState("")
  const [filterAsset, setFilterAsset] = useState("all")
  const [filterAction, setFilterAction] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const router = useRouter()
  const { toast } = useToast()

  // Get unique assets
  const assets = Array.from(new Set(allTrades.map((t) => t.asset)))

  // Filter and sort trades
  const filteredTrades = allTrades
    .filter((trade) => {
      const matchesSearch = trade.asset.toLowerCase().includes(search.toLowerCase())
      const matchesAsset = filterAsset === "all" || trade.asset === filterAsset
      const matchesAction = filterAction === "all" || trade.action === filterAction
      return matchesSearch && matchesAsset && matchesAction
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      if (sortBy === "profit") return b.profit - a.profit
      if (sortBy === "amount") return b.amount - a.amount
      return 0
    })

  const handleCopyTrade = (traderId: string) => {
    router.push(`/trader/${traderId}`)
  }

  const handleViewProfile = (traderId: string) => {
    router.push(`/trader/${traderId}`)
  }

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Live Trades</h1>
        <p className="text-muted-foreground">Track real-time trades from top-performing traders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Sorting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Asset</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Asset</label>
              <Select value={filterAsset} onValueChange={setFilterAsset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  {assets.map((asset) => (
                    <SelectItem key={asset} value={asset}>
                      {asset}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="BUY">Buy Only</SelectItem>
                  <SelectItem value="SELL">Sell Only</SelectItem>
                  <SelectItem value="HOLD">Hold Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="profit">Highest P&L</SelectItem>
                  <SelectItem value="amount">Largest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trades List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {filteredTrades.length} {filteredTrades.length === 1 ? "Trade" : "Trades"}
          </h2>
          <Badge variant="secondary" className="text-sm">
            {allTrades.filter((t) => t.status === "open").length} Open Positions
          </Badge>
        </div>

        {filteredTrades.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No trades found matching your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredTrades.map((trade) => {
            const isProfitable = trade.profit > 0
            return (
              <Card key={trade.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleViewProfile(trade.trader.address)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={trade.trader.avatar || "/placeholder.svg"} alt={trade.trader.displayName} />
                        <AvatarFallback>{trade.trader.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold hover:underline">{trade.trader.displayName}</p>
                        <p className="text-sm text-muted-foreground">{trade.trader.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={trade.status === "open" ? "default" : "secondary"}
                        className={cn("font-medium", trade.status === "open" ? "bg-blue-500" : "")}
                      >
                        {trade.status}
                      </Badge>
                      <Badge
                        variant={trade.action === "BUY" ? "default" : "secondary"}
                        className={cn(
                          "font-semibold",
                          trade.action === "BUY"
                            ? "bg-success text-success-foreground"
                            : trade.action === "SELL"
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-warning text-warning-foreground",
                        )}
                      >
                        {trade.action}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Asset</p>
                      <p className="text-lg font-bold">{trade.asset}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Amount</p>
                      <p className="text-lg font-semibold">{trade.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="text-lg font-semibold">{trade.price > 0 ? `$${trade.price.toFixed(2)}` : "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">P&L</p>
                      <p
                        className={cn(
                          "text-lg font-semibold flex items-center gap-1",
                          isProfitable ? "text-success" : "text-destructive",
                        )}
                      >
                        {isProfitable ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {trade.profit > 0 ? "+" : ""}
                        {trade.profit.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {new Date(trade.timestamp).toLocaleDateString()} at{" "}
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </p>
                    <Button size="sm" onClick={() => handleCopyTrade(trade.trader.address)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Trader
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default function TradePage() {
  return (
    <ProtectedRoute>
      <TradePageContent />
    </ProtectedRoute>
  )
}
