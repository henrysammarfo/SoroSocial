"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, Info } from "lucide-react"

interface CopyTradeConfigProps {
  trader: any
  onComplete: (config: any) => void
}

export function CopyTradeConfig({ trader, onComplete }: CopyTradeConfigProps) {
  const [investmentAmount, setInvestmentAmount] = useState("5000")
  const [copyRatio, setCopyRatio] = useState([100])
  const [stopLoss, setStopLoss] = useState("20")
  const [takeProfit, setTakeProfit] = useState("50")
  const [copyMode, setCopyMode] = useState("proportional")
  const [autoRebalance, setAutoRebalance] = useState(true)

  const handleSubmit = () => {
    onComplete({
      investmentAmount: Number.parseFloat(investmentAmount),
      copyRatio: copyRatio[0],
      stopLoss: Number.parseFloat(stopLoss),
      takeProfit: Number.parseFloat(takeProfit),
      copyMode,
      autoRebalance,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="h-12 w-12">
            <AvatarImage src={trader.avatar || "/placeholder.svg"} alt={trader.name} />
            <AvatarFallback>{trader.name[0]}</AvatarFallback>
          </Avatar>
          <div>
                        <div className="flex items-center gap-1.5">
              <span className="font-semibold">{trader.displayName || trader.name}</span>
              {trader.verified && <CheckCircle2 className="h-4 w-4 fill-primary text-primary-foreground" />}
            </div>
            <p className="text-sm text-muted-foreground">{trader.username}</p></search>
</search_and_replace>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="investment">Investment Amount ($)</Label>
            <Input
              id="investment"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="5000"
            />
            <p className="text-xs text-muted-foreground">Minimum investment: $1,000</p>
          </div>

          <div className="space-y-2">
            <Label>Copy Ratio: {copyRatio[0]}%</Label>
            <Slider value={copyRatio} onValueChange={setCopyRatio} max={100} min={10} step={10} className="py-4" />
            <p className="text-xs text-muted-foreground">Percentage of trader's position size to copy</p>
          </div>

          <div className="space-y-3">
            <Label>Copy Mode</Label>
            <RadioGroup value={copyMode} onValueChange={setCopyMode}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="proportional" id="proportional" />
                <Label htmlFor="proportional" className="font-normal cursor-pointer">
                  Proportional - Copy based on your investment amount
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed" className="font-normal cursor-pointer">
                  Fixed Amount - Copy exact position sizes
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss (%)</Label>
              <Input
                id="stopLoss"
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit (%)</Label>
              <Input
                id="takeProfit"
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="autoRebalance">Auto-Rebalance</Label>
              <p className="text-xs text-muted-foreground">
                Automatically adjust positions to match trader's portfolio
              </p>
            </div>
            <Switch id="autoRebalance" checked={autoRebalance} onCheckedChange={setAutoRebalance} />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Important Information</p>
            <p className="text-muted-foreground">
              Copy trading involves risk. Past performance does not guarantee future results. You can stop copying at
              any time.
            </p>
          </div>
        </div>
      </Card>

      <Button onClick={handleSubmit} size="lg" className="w-full">
        Continue to Review
      </Button>
    </div>
  )
}
