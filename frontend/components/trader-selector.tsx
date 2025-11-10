"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const traders = [
  {
    id: "1",
    name: "Sarah Chen",
    username: "@sarahtrader",
    avatar: "/placeholder.svg?key=sarah",
    verified: true,
    followers: 12500,
    copiers: 1234,
    returnRate: 142.5,
    winRate: 68.3,
    riskLevel: "Medium",
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    username: "@miketrading",
    avatar: "/placeholder.svg?key=mike",
    verified: true,
    followers: 8900,
    copiers: 892,
    returnRate: 98.2,
    winRate: 62.1,
    riskLevel: "High",
  },
  {
    id: "3",
    name: "Emma Thompson",
    username: "@emmafinance",
    avatar: "/placeholder.svg?key=emma",
    verified: false,
    followers: 3200,
    copiers: 234,
    returnRate: 76.8,
    winRate: 71.5,
    riskLevel: "Low",
  },
]

interface TraderSelectorProps {
  onSelect: (trader: any) => void
}

export function TraderSelector({ onSelect }: TraderSelectorProps) {
  const [search, setSearch] = useState("")

  const filteredTraders = traders.filter(
    (trader) =>
      trader.name.toLowerCase().includes(search.toLowerCase()) ||
      trader.username.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search traders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {filteredTraders.map((trader) => (
          <Card key={trader.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={trader.avatar || "/placeholder.svg"} alt={trader.name} />
                  <AvatarFallback>{trader.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-semibold">{trader.name}</span>
                    {trader.verified && <CheckCircle2 className="h-4 w-4 fill-primary text-primary-foreground" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{trader.username}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-success flex items-center gap-1">
                  <TrendingUp className="h-5 w-5" />+{trader.returnRate}%
                </div>
                <div className="text-xs text-muted-foreground">12-month return</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{trader.winRate}%</div>
                <div className="text-xs text-muted-foreground">Win rate</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Copiers:</span>{" "}
                <span className="font-medium">{trader.copiers.toLocaleString()}</span>
              </div>
              <Badge variant="secondary">{trader.riskLevel} Risk</Badge>
            </div>

            <Button onClick={() => onSelect(trader)} className="w-full">
              Select Trader
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
