"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, Users, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Portfolio } from "@/lib/types"

interface PortfolioOverviewProps {
  portfolio: Portfolio | null
}

export function PortfolioOverview({ portfolio }: PortfolioOverviewProps) {
  if (!portfolio) {
    return null
  }

  const stats = [
    {
      label: "Total Value",
      value: `$${portfolio.totalValue.toLocaleString()}`,
      change: `$${portfolio.totalReturn.toLocaleString()}`,
      changePercent: `+${((portfolio.totalReturn / portfolio.totalValue) * 100).toFixed(2)}%`,
      positive: portfolio.totalReturn > 0,
      icon: Wallet,
    },
    {
      label: "Today's P&L",
      value:
        portfolio.todayPnL >= 0 ? `+$${portfolio.todayPnL.toFixed(2)}` : `-$${Math.abs(portfolio.todayPnL).toFixed(2)}`,
      change: `${((portfolio.todayPnL / portfolio.totalValue) * 100).toFixed(2)}%`,
      changePercent: "vs yesterday",
      positive: portfolio.todayPnL > 0,
      icon: Activity,
    },
    {
      label: "Active Copies",
      value: portfolio.activeCopies.toString(),
      change: "Following traders",
      changePercent: "Copy trading",
      positive: null,
      icon: Users,
    },
    {
      label: "Total Return",
      value: `+${((portfolio.totalReturn / portfolio.totalValue) * 100).toFixed(1)}%`,
      change: "All time",
      changePercent: "Since start",
      positive: portfolio.totalReturn > 0,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              {stat.positive !== null &&
                (stat.positive ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                ))}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p
                className={cn(
                  "text-2xl font-bold",
                  stat.positive === true && "text-success",
                  stat.positive === false && "text-destructive",
                )}
              >
                {stat.value}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    "font-medium",
                    stat.positive === true && "text-success",
                    stat.positive === false && "text-destructive",
                    stat.positive === null && "text-muted-foreground",
                  )}
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground">{stat.changePercent}</span>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
