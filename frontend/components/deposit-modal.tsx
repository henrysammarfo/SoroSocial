"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"
import { Loader2, Wallet } from "lucide-react"

interface DepositModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const deposit = useStore((state) => state.deposit)
  const { toast } = useToast()

  const handleDeposit = async () => {
    const depositAmount = Number.parseFloat(amount)

    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
      })
      return
    }

    if (depositAmount < 10) {
      toast({
        variant: "destructive",
        title: "Minimum deposit",
        description: "Minimum deposit amount is 10 XLM",
      })
      return
    }

    setIsProcessing(true)

    // TODO: Integrate with Stellar Scaffold smart contract
    console.log("[v0] Smart Contract: Deposit XLM", { amount: depositAmount })

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    deposit(depositAmount)

    toast({
      title: "Deposit successful",
      description: `${depositAmount} XLM has been added to your wallet`,
    })

    setAmount("")
    setIsProcessing(false)
    onOpenChange(false)
  }

  const quickAmounts = [10, 50, 100, 500]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit XLM</DialogTitle>
          <DialogDescription>Add funds to your trading wallet</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (XLM)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
              step="0.01"
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground">Minimum: 10 XLM</p>
          </div>

          <div className="space-y-2">
            <Label>Quick Select</Label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  disabled={isProcessing}
                >
                  {quickAmount}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Network: Stellar Testnet</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Transactions are processed instantly on the Stellar blockchain
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleDeposit} disabled={isProcessing || !amount} className="flex-1">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Deposit"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
