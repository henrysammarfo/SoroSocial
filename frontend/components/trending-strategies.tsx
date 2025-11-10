"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Flame } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { Trader } from "@/lib/types"
import { useRouter } from "next/navigation"

interface TrendingStrategiesProps {
  traders?: Trader[]
}

export function TrendingStrategies({ traders }: TrendingStrategiesProps) {
  const router = useRouter()

  const strategies =
    traders && traders.length > 0
      ? traders.slice(0, 5).map((trader, idx) => ({
          id: trader.address,
          name: trader.displayName,
          description: `${trader.riskScore <= 3 ? "Low" : trader.riskScore <= 6 ? "Medium" : "High"} risk • ${trader.winRate.toFixed(1)}% win rate`,
          traders: trader.copiers,
          avgReturn: trader.totalReturn,
          trending: idx < 3,
        }))
      : mockStrategies

  const handleStrategyClick = (strategyId: string) => {
    router.push(`/trader/${strategyId}`)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Flame className="h-5 w-5 text-orange-500" />
        <h2 className="text-xl font-semibold">Trending Strategies</h2>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {strategies.map((strategy) => (
            <Card
              key={strategy.id}
              className="min-w-[280px] p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleStrategyClick(strategy.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{strategy.name}</h3>
                {strategy.trending && (
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <Flame className="h-3 w-3 mr-1" />
                    Hot
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Traders:</span>{" "}
                  <span className="font-medium">{strategy.traders}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-success">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {strategy.avgReturn > 0 ? "+" : ""}
                  {strategy.avgReturn.toFixed(1)}%
                </div>
              </div>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

// Mock data fallback
const mockStrategies = [
  {
    id: "1",
    name: "Tech Growth",
    description: "Focus on high-growth tech stocks",
    traders: 234,
    avgReturn: 45.2,
    trending: true,
  },
  {
    id: "2",
    name: "Dividend Value",
    description: "Stable dividend-paying stocks",
    traders: 189,
    avgReturn: 28.5,
    trending: false,
  },
  {
    id: "3",
    name: "Day Trading",
    description: "Short-term momentum plays",
    traders: 156,
    avgReturn: 62.8,
    trending: true,
  },
  {
    id: "4",
    name: "Index Following",
    description: "Mirror major market indices",
    traders: 312,
    avgReturn: 18.3,
    trending: false,
  },
  {
    id: "5",
    name: "Swing Trading",
    description: "Multi-day position holds",
    traders: 198,
    avgReturn: 38.7,
    trending: true,
  },
]
