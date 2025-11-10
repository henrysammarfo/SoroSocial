"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, Check } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface CopyTradeConfirmationProps {
  trader: any
  config: any
  onConfirm: () => void
}

export function CopyTradeConfirmation({ trader, config, onConfirm }: CopyTradeConfirmationProps) {
  if (!trader || !config) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Missing trader or configuration data</p>
      </Card>
    )
  }

  const traderName = trader.displayName || trader.name || "Trader"
  const traderUsername = trader.username || trader.address || ""

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Review Your Copy Trade Setup</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Trader</h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={trader.avatar || "/placeholder.svg"} alt={traderName} />
                <AvatarFallback>{traderName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">{traderName}</span>
                  {trader.verified && <CheckCircle2 className="h-4 w-4 fill-primary text-primary-foreground" />}
                </div>
                <p className="text-sm text-muted-foreground">{traderUsername}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Configuration</h3>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Investment Amount</span>
              <span className="text-sm font-medium">
                {Number.parseFloat(config.investmentAmount).toLocaleString()} XLM
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Copy Ratio</span>
              <span className="text-sm font-medium">{config.copyRatio}%</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Copy Mode</span>
              <span className="text-sm font-medium capitalize">{config.copyMode || "instant"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Stop Loss</span>
              <span className="text-sm font-medium">{config.stopLoss || 0}%</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Take Profit</span>
              <span className="text-sm font-medium">{config.takeProfit || 0}%</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Auto-Rebalance</span>
              <span className="text-sm font-medium">{config.autoRebalance ? "Enabled" : "Disabled"}</span>
            </div>
          </div>

          <Separator />

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h3 className="text-sm font-medium mb-3">What happens next?</h3>
            <div className="space-y-2">
              <div className="flex gap-2 text-sm">
                <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span>Your account will automatically copy {traderName}'s trades</span>
              </div>
              <div className="flex gap-2 text-sm">
                <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span>Positions will be opened based on your copy ratio</span>
              </div>
              <div className="flex gap-2 text-sm">
                <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span>Stop loss and take profit will be applied automatically</span>
              </div>
              <div className="flex gap-2 text-sm">
                <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span>You can pause or stop copying at any time</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Button onClick={onConfirm} size="lg" className="w-full">
        Confirm & Start Copying
      </Button>
    </div>
  )
}
