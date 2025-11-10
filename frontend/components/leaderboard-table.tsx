"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, TrendingUp, Users, Target } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import type { Trader } from "@/lib/types"

interface LeaderboardTableProps {
  traders?: Trader[]
}

export function LeaderboardTable({ traders }: LeaderboardTableProps) {
  const router = useRouter()

  const leaderboardData =
    traders && traders.length > 0
      ? traders
          .filter((trader) => trader && trader.displayName && trader.address)
          .map((trader, index) => ({
            rank: index + 1,
            trader: {
              id: trader.address,
              name: trader.displayName,
              username: trader.username,
              avatar: trader.avatar,
              verified: trader.verified,
            },
            stats: {
              return: trader.totalReturn,
              winRate: trader.winRate,
              followers: trader.followers,
              copiers: trader.copiers,
              trades: trader.totalTrades,
              riskLevel: trader.riskScore <= 3 ? "Low" : trader.riskScore <= 6 ? "Medium" : "High",
            },
          }))
      : mockLeaderboardData

  const handleCopy = (traderId: string) => {
    console.log("[v0] Starting copy trading setup for trader:", traderId)
    router.push(`/trader/${traderId}`)
  }

  const handleTraderClick = (traderId: string) => {
    router.push(`/trader/${traderId}`)
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Top Traders</h3>
        <p className="text-sm text-muted-foreground">Ranked by 12-month performance</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Trader</TableHead>
              <TableHead>Return</TableHead>
              <TableHead>Win Rate</TableHead>
              <TableHead>Copiers</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((item) => (
              <TableRow key={item.rank} className="cursor-pointer" onClick={() => handleTraderClick(item.trader.id)}>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {item.rank <= 3 ? (
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                          item.rank === 1
                            ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                            : item.rank === 2
                              ? "bg-gray-400/20 text-gray-600 dark:text-gray-400"
                              : "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {item.rank}
                      </div>
                    ) : (
                      <span className="font-medium text-muted-foreground">{item.rank}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item.trader.avatar || "/placeholder.svg"} alt={item.trader.name} />
                      <AvatarFallback>{item.trader.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{item.trader.name}</span>
                        {item.trader.verified && (
                          <CheckCircle2 className="h-4 w-4 fill-primary text-primary-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.trader.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-semibold text-success">
                    <TrendingUp className="h-4 w-4" />
                    {item.stats.return > 0 ? "+" : ""}
                    {item.stats.return.toFixed(1)}%
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{item.stats.winRate.toFixed(1)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{item.stats.copiers.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      item.stats.riskLevel === "Low"
                        ? "bg-success/10 text-success"
                        : item.stats.riskLevel === "High"
                          ? "bg-destructive/10 text-destructive"
                          : ""
                    }
                  >
                    {item.stats.riskLevel}
                  </Badge>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" onClick={() => handleCopy(item.trader.id)}>
                    Copy
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

// Mock data fallback
const mockLeaderboardData = [
  {
    rank: 1,
    trader: {
      id: "1",
      name: "Sarah Chen",
      username: "@sarahtrader",
      avatar: "/placeholder.svg?key=sarah3",
      verified: true,
    },
    stats: {
      return: 142.5,
      winRate: 68.3,
      followers: 12500,
      copiers: 1234,
      trades: 343,
      riskLevel: "Medium",
    },
  },
  {
    rank: 2,
    trader: {
      id: "2",
      name: "Mike Rodriguez",
      username: "@miketrading",
      avatar: "/placeholder.svg?key=mike3",
      verified: true,
    },
    stats: {
      return: 128.7,
      winRate: 65.8,
      followers: 10200,
      copiers: 982,
      trades: 298,
      riskLevel: "High",
    },
  },
  {
    rank: 3,
    trader: {
      id: "3",
      name: "David Kim",
      username: "@davidtrades",
      avatar: "/placeholder.svg?key=david",
      verified: true,
    },
    stats: {
      return: 115.3,
      winRate: 72.1,
      followers: 9800,
      copiers: 876,
      trades: 412,
      riskLevel: "Low",
    },
  },
  {
    rank: 4,
    trader: {
      id: "4",
      name: "Lisa Wang",
      username: "@lisainvests",
      avatar: "/placeholder.svg?key=lisa",
      verified: true,
    },
    stats: {
      return: 98.2,
      winRate: 62.1,
      followers: 8900,
      copiers: 734,
      trades: 267,
      riskLevel: "Medium",
    },
  },
  {
    rank: 5,
    trader: {
      id: "5",
      name: "Emma Thompson",
      username: "@emmafinance",
      avatar: "/placeholder.svg?key=emma3",
      verified: false,
    },
    stats: {
      return: 89.5,
      winRate: 71.5,
      followers: 7200,
      copiers: 623,
      trades: 189,
      riskLevel: "Low",
    },
  },
  {
    rank: 6,
    trader: {
      id: "6",
      name: "James Wilson",
      username: "@jameswilson",
      avatar: "/placeholder.svg?key=james",
      verified: true,
    },
    stats: {
      return: 82.4,
      winRate: 64.3,
      followers: 6500,
      copiers: 542,
      trades: 234,
      riskLevel: "Medium",
    },
  },
  {
    rank: 7,
    trader: {
      id: "7",
      name: "Maria Garcia",
      username: "@mariatrades",
      avatar: "/placeholder.svg?key=maria",
      verified: false,
    },
    stats: {
      return: 76.8,
      winRate: 69.2,
      followers: 5800,
      copiers: 487,
      trades: 156,
      riskLevel: "Low",
    },
  },
  {
    rank: 8,
    trader: {
      id: "8",
      name: "Alex Johnson",
      username: "@alexjtrader",
      avatar: "/placeholder.svg?key=alex",
      verified: true,
    },
    stats: {
      return: 71.2,
      winRate: 58.9,
      followers: 5200,
      copiers: 421,
      trades: 312,
      riskLevel: "High",
    },
  },
]
