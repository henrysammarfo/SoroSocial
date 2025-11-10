"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Target, Award, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Trader } from "@/lib/types"
import { useStore } from "@/lib/store"
import { useMemo } from "react"

interface ProfileStatsProps {
  trader: Trader | null
}

export function ProfileStats({ trader }: ProfileStatsProps) {
  const activeCopies = useStore((state) => state.activeCopies)
  const wallet = useStore((state) => state.wallet)

  const realTimeStats = useMemo(() => {
    if (!trader) return null

    // Calculate total profit from active copies
    const totalProfit = activeCopies.reduce((sum, copy) => sum + (copy.totalProfit || 0), 0)

    // Calculate total invested
    const totalInvested = activeCopies.reduce((sum, copy) => sum + copy.amount, 0)

    // Calculate total return percentage
    const totalReturnPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0

    // Calculate win rate from completed trades
    const completedTrades = activeCopies.reduce((sum, copy) => sum + (copy.trader?.totalTrades || 0), 0)
    const successfulTrades = activeCopies.reduce((sum, copy) => sum + (copy.trader?.successfulTrades || 0), 0)
    const winRate = completedTrades > 0 ? (successfulTrades / completedTrades) * 100 : 0

    // Calculate average return
    const avgReturn = activeCopies.length > 0 ? totalProfit / activeCopies.length : 0

    return {
      totalReturn: totalReturnPercent.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      winRate: winRate.toFixed(1),
      avgReturn: avgReturn.toFixed(2),
      totalTrades: completedTrades,
      successfulTrades: successfulTrades,
      activeCopiesCount: activeCopies.filter((c) => !c.paused).length,
    }
  }, [trader, activeCopies, wallet])

  if (!trader || !realTimeStats) {
    return null
  }

  const stats = [
    {
      label: "Total Return",
      value: `${Number(realTimeStats.totalReturn) >= 0 ? "+" : ""}${realTimeStats.totalReturn}%`,
      subtext: `$${realTimeStats.totalProfit} profit`,
      icon: TrendingUp,
      positive: Number(realTimeStats.totalReturn) >= 0,
    },
    {
      label: "Win Rate",
      value: `${realTimeStats.winRate}%`,
      subtext: `${realTimeStats.successfulTrades} of ${realTimeStats.totalTrades} trades`,
      icon: Target,
      positive: Number(realTimeStats.winRate) >= 50,
    },
    {
      label: "Avg. Return",
      value: `${Number(realTimeStats.avgReturn) >= 0 ? "+" : ""}$${realTimeStats.avgReturn}`,
      subtext: "Per copy trade",
      icon: Award,
      positive: Number(realTimeStats.avgReturn) >= 0,
    },
    {
      label: "Active Copies",
      value: `${realTimeStats.activeCopiesCount}`,
      subtext: `${activeCopies.length} total copies`,
      icon: Trophy,
      positive: null,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div
              className={cn(
                "text-2xl font-bold",
                stat.positive === true && "text-success",
                stat.positive === false && "text-destructive",
              )}
            >
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.subtext}</div>
          </Card>
        )
      })}
    </div>
  )
}
