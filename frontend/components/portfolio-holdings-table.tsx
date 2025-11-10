"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
    source: "Sarah Chen",
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
    source: "Mike Rodriguez",
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
    source: "Sarah Chen",
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
    source: "Emma Thompson",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    quantity: 20,
    avgPrice: 245.8,
    currentPrice: 242.8,
    value: 4856.0,
    profit: -60.0,
    profitPercent: -1.2,
    source: "Mike Rodriguez",
  },
]

export function PortfolioHoldingsTable() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Holdings</h3>
        <p className="text-sm text-muted-foreground">All positions across your portfolio</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Avg Price</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>P&L</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding) => {
              const isProfitable = holding.profit > 0
              return (
                <TableRow key={holding.symbol}>
                  <TableCell>
                    <div>
                      <div className="font-semibold">{holding.symbol}</div>
                      <div className="text-xs text-muted-foreground">{holding.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{holding.quantity}</TableCell>
                  <TableCell>${holding.avgPrice.toFixed(2)}</TableCell>
                  <TableCell>${holding.currentPrice.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">${holding.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "flex items-center gap-1 font-medium",
                        isProfitable ? "text-success" : "text-destructive",
                      )}
                    >
                      {isProfitable ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <div>
                        <div>
                          {isProfitable ? "+" : ""}${Math.abs(holding.profit).toFixed(2)}
                        </div>
                        <div className="text-xs">
                          {isProfitable ? "+" : ""}
                          {holding.profitPercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {holding.source}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
