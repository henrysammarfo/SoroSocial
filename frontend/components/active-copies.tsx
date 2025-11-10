"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, TrendingUp, Pause, Play, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"
import type { ActiveCopy } from "@/lib/types"

interface ActiveCopiesProps {
  activeCopies?: ActiveCopy[]
  onUpdate?: () => void
}

export function ActiveCopies({ activeCopies: propActiveCopies, onUpdate }: ActiveCopiesProps) {
  const storeActiveCopies = useStore((state) => state.activeCopies)
  const pauseCopyTrading = useStore((state) => state.pauseCopyTrading)
  const resumeCopyTrading = useStore((state) => state.resumeCopyTrading)
  const stopCopyTrading = useStore((state) => state.stopCopyTrading)

  const copies = propActiveCopies || storeActiveCopies
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handlePause = async (traderId: string) => {
    setLoadingId(traderId)

    await new Promise((resolve) => setTimeout(resolve, 500))
    pauseCopyTrading(traderId)

    toast({
      title: "Copy trading paused",
      description: "You can resume anytime from your portfolio",
    })

    if (onUpdate) onUpdate()
    setLoadingId(null)
  }

  const handleResume = async (traderId: string) => {
    setLoadingId(traderId)

    await new Promise((resolve) => setTimeout(resolve, 500))
    resumeCopyTrading(traderId)

    toast({
      title: "Copy trading resumed",
      description: "Now copying new trades from this trader",
    })

    if (onUpdate) onUpdate()
    setLoadingId(null)
  }

  const handleStop = async (traderId: string) => {
    setLoadingId(traderId)

    await new Promise((resolve) => setTimeout(resolve, 500))
    stopCopyTrading(traderId)

    toast({
      title: "Copy trading stopped",
      description: "Funds returned to your wallet",
    })

    if (onUpdate) onUpdate()
    setLoadingId(null)
  }

  if (copies.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No active copy trades</p>
          <Button asChild>
            <a href="/discover">Discover Traders</a>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Active Copy Trades</h3>
          <p className="text-sm text-muted-foreground">Manage your copy trading positions</p>
        </div>
      </div>

      <div className="space-y-4">
        {copies.map((copy) => {
          const isProfitable = copy.totalProfit > 0
          const traderId = copy.trader.id || copy.trader.address
          const isLoading = loadingId === traderId

          return (
            <Card key={traderId} className="p-4 bg-muted/30">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={copy.trader.avatar || "/placeholder.svg"} alt={copy.trader.displayName} />
                    <AvatarFallback>{copy.trader.displayName?.[0] || copy.trader.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-semibold">{copy.trader.displayName || copy.trader.username}</span>
                      {copy.trader.verified && (
                        <CheckCircle2 className="h-4 w-4 fill-primary text-primary-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Started {new Date(copy.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={copy.paused ? "secondary" : "default"}
                  className={copy.active && !copy.paused ? "bg-success/10 text-success" : ""}
                >
                  {copy.paused ? "Paused" : copy.active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Allocated</div>
                  <div className="text-sm font-semibold">{copy.amount.toLocaleString()} XLM</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Current Value</div>
                  <div className="text-sm font-semibold">{(copy.amount + copy.totalProfit).toLocaleString()} XLM</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">P&L</div>
                  <div
                    className={`text-sm font-semibold flex items-center gap-1 ${
                      isProfitable ? "text-success" : "text-destructive"
                    }`}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    {isProfitable ? "+" : ""}
                    {Math.abs(copy.totalProfit).toFixed(2)} XLM
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Copy Ratio</span>
                  <span className="font-medium">{copy.copyRatio}%</span>
                </div>
                <Progress value={copy.copyRatio} className="h-2" />
              </div>

              <div className="flex gap-2">
                {!copy.paused ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handlePause(traderId)}
                    disabled={isLoading}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    {isLoading ? "Loading..." : "Pause"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleResume(traderId)}
                    disabled={isLoading}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isLoading ? "Loading..." : "Resume"}
                  </Button>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent text-destructive"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Stop Copy Trading?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will stop copying {copy.trader.displayName || copy.trader.username}'s trades and return{" "}
                        {(copy.amount + copy.totalProfit).toLocaleString()} XLM to your wallet.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleStop(traderId)}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Stop Copying
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          )
        })}
      </div>
    </Card>
  )
}
