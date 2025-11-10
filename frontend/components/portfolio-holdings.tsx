"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

const holdings = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    quantity: 50,
    avgPrice: 165.2,
    currentPrice: 178.45,
    value: 8922.5,
    profit: 662.5,
    profitPercent: 8.0,
    allocation: 28,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    quantity: 15,
    avgPrice: 455.8,
    currentPrice: 495.2,
    value: 7428.0,
    profit: 591.0,
    profitPercent: 8.6,
    allocation: 23,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    quantity: 30,
    avgPrice: 335.4,
    currentPrice: 385.6,
    value: 11568.0,
    profit: 1506.0,
    profitPercent: 15.0,
    allocation: 36,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    quantity: 40,
    avgPrice: 135.6,
    currentPrice: 142.3,
    value: 5692.0,
    profit: 268.0,
    profitPercent: 4.9,
    allocation: 13,
  },
]

export function PortfolioHoldings() {
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0)

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Portfolio Value</div>
            <div className="text-3xl font-bold">${totalValue.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Total P&L</div>
            <div className="text-xl font-semibold text-success flex items-center gap-1">
              <TrendingUp className="h-5 w-5" />
              +$3,027.50
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {holdings.map((holding) => {
          const isProfitable = holding.profit > 0
          return (
            <Card key={holding.symbol} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold">{holding.symbol}</span>
                    <span className="text-sm text-muted-foreground">{holding.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {holding.quantity} shares @ ${holding.avgPrice.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">${holding.value.toLocaleString()}</div>
                  <div
                    className={cn(
                      "text-sm font-medium flex items-center justify-end gap-1",
                      isProfitable ? "text-success" : "text-destructive",
                    )}
                  >
                    {isProfitable ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {isProfitable ? "+" : ""}${Math.abs(holding.profit).toFixed(2)} ({isProfitable ? "+" : ""}
                    {holding.profitPercent.toFixed(1)}%)
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Portfolio Allocation</span>
                  <span>{holding.allocation}%</span>
                </div>
                <Progress value={holding.allocation} className="h-2" />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
