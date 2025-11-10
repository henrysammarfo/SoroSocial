"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TraderSelector } from "@/components/trader-selector"
import { CopyTradeConfig } from "@/components/copy-trade-config"
import { CopyTradeConfirmation } from "@/components/copy-trade-confirmation"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

type Step = "select" | "configure" | "confirm"

export function CopyTradeSetup() {
  const router = useRouter()
  const { toast } = useToast()
  const startCopyTrading = useStore((state) => state.startCopyTrading)
  const wallet = useStore((state) => state.wallet)

  const [step, setStep] = useState<Step>("select")
  const [selectedTrader, setSelectedTrader] = useState<any>(null)
  const [config, setConfig] = useState<any>(null)

  const handleTraderSelect = (trader: any) => {
    setSelectedTrader(trader)
    setStep("configure")
  }

  const handleConfigComplete = (configuration: any) => {
    setConfig(configuration)
    setStep("confirm")
  }

  const handleBack = () => {
    if (step === "configure") {
      setStep("select")
    } else if (step === "confirm") {
      setStep("configure")
    }
  }

  const handleConfirm = () => {
    if (!selectedTrader || !config) return

    const amount = Number.parseFloat(config.investmentAmount)

    if (amount > wallet.balance) {
      toast({
        title: "Insufficient balance",
        description: `You need ${amount.toLocaleString()} XLM but only have ${wallet.balance.toLocaleString()} XLM`,
        variant: "destructive",
      })
      return
    }

    const copyConfig = {
      trader: selectedTrader,
      amount,
      copyRatio: config.copyRatio,
      stopLoss: Number.parseFloat(config.stopLoss) || 0,
      takeProfit: Number.parseFloat(config.takeProfit) || 0,
      maxPerTrade: config.maxPerTrade ? Number.parseFloat(config.maxPerTrade) : amount,
      active: true,
      paused: false,
      totalProfit: 0,
      startDate: new Date().toISOString(),
    }

    startCopyTrading(copyConfig)

    toast({
      title: "Copy trading activated",
      description: `Now copying ${selectedTrader.displayName}'s trades`,
    })

    router.push("/portfolio")
  }

  return (
    <div>
      {step !== "select" && (
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}

      {step === "select" && <TraderSelector onSelect={handleTraderSelect} />}
      {step === "configure" && selectedTrader && (
        <CopyTradeConfig trader={selectedTrader} onComplete={handleConfigComplete} />
      )}
      {step === "confirm" && selectedTrader && config && (
        <CopyTradeConfirmation trader={selectedTrader} config={config} onConfirm={handleConfirm} />
      )}
    </div>
  )
}
