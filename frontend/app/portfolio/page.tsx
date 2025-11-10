"use client"

import { PortfolioOverview } from "@/components/portfolio-overview"
import { PortfolioChart } from "@/components/portfolio-chart"
import { ActiveCopies } from "@/components/active-copies"
import { PortfolioHoldingsTable } from "@/components/portfolio-holdings-table"
import { useEffect, useState, useMemo } from "react"
import { useStore } from "@/lib/store"
import type { Portfolio } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { ProtectedRoute } from "@/components/protected-route"

function PortfolioPageContent() {
  const wallet = useStore((state) => state.wallet)
  const activeCopies = useStore((state) => state.activeCopies)
  const trades = useStore((state) => state.trades)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const portfolio = useMemo<Portfolio | null>(() => {
    if (!wallet.connected) return null

    const totalAllocated = activeCopies.reduce((sum, copy) => sum + copy.amount, 0)
    const totalProfit = activeCopies.reduce((sum, copy) => sum + (copy.totalProfit || 0), 0)
    const totalValue = wallet.balance + totalAllocated + totalProfit

    // Simulate today's P&L as a percentage of total profit
    const todayPnL = totalProfit * 0.15 // Simulate 15% of profit made today

    const holdingsMap = new Map()

    // Add holdings from active copy trades
    activeCopies.forEach((copy) => {
      const traderName = copy.trader.displayName || copy.trader.username
      const existingHolding = holdingsMap.get(traderName)

      if (existingHolding) {
        existingHolding.quantity += copy.amount
        existingHolding.totalValue += copy.amount + copy.totalProfit
        existingHolding.pnl += copy.totalProfit
      } else {
        holdingsMap.set(traderName, {
          asset: traderName,
          quantity: copy.amount,
          avgPrice: 1,
          currentPrice: 1 + copy.totalProfit / copy.amount,
          totalValue: copy.amount + copy.totalProfit,
          pnl: copy.totalProfit,
          pnlPercent: (copy.totalProfit / copy.amount) * 100,
        })
      }
    })

    // Add holdings from user's actual token positions (from trades)
    const userTrades = trades.filter((t) => t.status === "open")
    userTrades.forEach((trade) => {
      const assetKey = trade.asset
      const existingHolding = holdingsMap.get(assetKey)
      const value = trade.amount * trade.price

      if (existingHolding) {
        existingHolding.quantity += trade.amount
        existingHolding.totalValue += value
        existingHolding.pnl += (value * trade.profit) / 100
      } else {
        holdingsMap.set(assetKey, {
          asset: trade.asset,
          quantity: trade.amount,
          avgPrice: trade.price,
          currentPrice: trade.price * (1 + trade.profit / 100),
          totalValue: value * (1 + trade.profit / 100),
          pnl: (value * trade.profit) / 100,
          pnlPercent: trade.profit,
        })
      }
    })

    return {
      totalValue,
      totalReturn: totalProfit,
      todayPnL,
      activeCopies: activeCopies.filter((c) => !c.paused).length,
      holdings: Array.from(holdingsMap.values()),
    }
  }, [wallet, activeCopies, trades])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
        <p className="text-muted-foreground">Track your investments and copy trading performance</p>
      </div>

      <PortfolioOverview portfolio={portfolio} />
      <PortfolioChart />
      <ActiveCopies />
      <PortfolioHoldingsTable holdings={portfolio?.holdings || []} />
    </div>
  )
}

export default function PortfolioPage() {
  return (
    <ProtectedRoute>
      <PortfolioPageContent />
    </ProtectedRoute>
  )
}
