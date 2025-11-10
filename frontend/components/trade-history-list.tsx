"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

const trades = [
  {
    id: "1",
    symbol: "AAPL",
    type: "BUY" as const,
    price: 178.45,
    quantity: 50,
    date: "2024-01-15",
    profit: 2450.5,
    profitPercent: 12.5,
    status: "closed" as const,
  },
  {
    id: "2",
    symbol: "NVDA",
    type: "BUY" as const,
    price: 495.2,
    quantity: 15,
    date: "2024-01-14",
    profit: 1820.75,
    profitPercent: 8.9,
    status: "open" as const,
  },
  {
    id: "3",
    symbol: "TSLA",
    type: "SELL" as const,
    price: 242.8,
    quantity: 25,
    date: "2024-01-13",
    profit: -850.25,
    profitPercent: -3.2,
    status: "closed" as const,
  },
  {
    id: "4",
    symbol: "MSFT",
    type: "BUY" as const,
    price: 385.6,
    quantity: 30,
    date: "2024-01-12",
    profit: 3240.0,
    profitPercent: 15.2,
    status: "closed" as const,
  },
  {
    id: "5",
    symbol: "GOOGL",
    type: "BUY" as const,
    price: 142.3,
    quantity: 40,
    date: "2024-01-11",
    profit: 1680.5,
    profitPercent: 9.8,
    status: "open" as const,
  },
]

export function TradeHistoryList() {
  return (
    <div className="space-y-3">
      {trades.map((trade) => {
        const isProfitable = trade.profit > 0
        return (
          <Card key={trade.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold">{trade.symbol}</span>
                    <Badge
                      variant={trade.type === "BUY" ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        trade.type === "BUY"
                          ? "bg-success text-success-foreground"
                          : "bg-destructive text-destructive-foreground",
                      )}
                    >
                      {trade.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {trade.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {trade.quantity} shares @ ${trade.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{trade.date}</div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={cn(
                    "text-lg font-semibold flex items-center justify-end gap-1",
                    isProfitable ? "text-success" : "text-destructive",
                  )}
                >
                  {isProfitable ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {isProfitable ? "+" : ""}${Math.abs(trade.profit).toFixed(2)}
                </div>
                <div className={cn("text-sm font-medium", isProfitable ? "text-success" : "text-destructive")}>
                  {isProfitable ? "+" : ""}
                  {trade.profitPercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
