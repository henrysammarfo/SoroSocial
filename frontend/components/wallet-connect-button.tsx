"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, Settings, User, Plus, Minus, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { DepositModal } from "@/components/deposit-modal"
import { WithdrawModal } from "@/components/withdraw-modal"

export function WalletConnectButton() {
  const router = useRouter()
  const wallet = useStore((state) => state.wallet)
  const connectWallet = useStore((state) => state.connectWallet)
  const disconnectWallet = useStore((state) => state.disconnectWallet)
  const needsProfileSetup = useStore((state) => state.needsProfileSetup)

  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const { toast } = useToast()

  const handleConnect = async () => {
    await connectWallet()
    toast({
      title: "Wallet connected",
      description: `Connected successfully`,
    })

    if (needsProfileSetup) {
      router.push("/setup-profile")
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    router.push("/")
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  if (!wallet.connected) {
    return (
      <Button onClick={handleConnect} size="sm" className="gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">
              {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
            </span>
            <span className="hidden md:inline">| {wallet.balance.toLocaleString()} XLM</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-2">
            <div className="text-sm text-muted-foreground mb-1">Balance</div>
            <div className="text-2xl font-bold">{wallet.balance.toLocaleString()} XLM</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDepositModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Deposit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowWithdrawModal(true)}>
            <Minus className="mr-2 h-4 w-4" />
            Withdraw
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/portfolio">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              My Portfolio
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DepositModal open={showDepositModal} onOpenChange={setShowDepositModal} />
      <WithdrawModal open={showWithdrawModal} onOpenChange={setShowWithdrawModal} />
    </>
  )
}
