"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"
import { Loader2, Wallet, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WithdrawModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const [amount, setAmount] = useState("")
  const [address, setAddress] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const wallet = useStore((state) => state.wallet)
  const withdraw = useStore((state) => state.withdraw)
  const { toast } = useToast()

  const handleWithdraw = async () => {
    const withdrawAmount = Number.parseFloat(amount)

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
      })
      return
    }

    if (withdrawAmount < 5) {
      toast({
        variant: "destructive",
        title: "Minimum withdrawal",
        description: "Minimum withdrawal amount is 5 XLM",
      })
      return
    }

    if (withdrawAmount > wallet.balance) {
      toast({
        variant: "destructive",
        title: "Insufficient balance",
        description: `You only have ${wallet.balance} XLM available`,
      })
      return
    }

    if (!address.trim()) {
      toast({
        variant: "destructive",
        title: "Address required",
        description: "Please enter a destination Stellar address",
      })
      return
    }

    if (!address.startsWith("G") || address.length !== 56) {
      toast({
        variant: "destructive",
        title: "Invalid address",
        description: "Please enter a valid Stellar address (starts with G, 56 characters)",
      })
      return
    }

    setIsProcessing(true)

    // TODO: Integrate with Stellar Scaffold smart contract
    console.log("[v0] Smart Contract: Withdraw XLM", { amount: withdrawAmount, destination: address })

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    withdraw(withdrawAmount)

    toast({
      title: "Withdrawal initiated",
      description: `${withdrawAmount} XLM is being sent to your wallet`,
    })

    setAmount("")
    setAddress("")
    setIsProcessing(false)
    onOpenChange(false)
  }

  const maxWithdraw = wallet.balance

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw XLM</DialogTitle>
          <DialogDescription>Send funds to your external Stellar wallet</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Amount (XLM)</Label>
            <Input
              id="withdraw-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="5"
              max={maxWithdraw}
              step="0.01"
              disabled={isProcessing}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Minimum: 5 XLM</span>
              <button
                type="button"
                onClick={() => setAmount(maxWithdraw.toString())}
                className="text-primary hover:underline"
                disabled={isProcessing}
              >
                Max: {maxWithdraw.toFixed(2)} XLM
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination Address</Label>
            <Input
              id="destination"
              type="text"
              placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isProcessing}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">Enter a valid Stellar address (starts with G)</p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Double-check the address. Transactions on the Stellar blockchain cannot be reversed.
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Network: Stellar Testnet</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Network fee: ~0.00001 XLM</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleWithdraw} disabled={isProcessing || !amount || !address} className="flex-1">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Withdraw"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
