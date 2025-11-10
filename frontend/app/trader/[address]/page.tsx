"use client"

import { ProfileHeader } from "@/components/profile-header"
import { ProfileStats } from "@/components/profile-stats"
import { ProfileTabs } from "@/components/profile-tabs"
import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import type { Trader } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"

function TraderProfilePageContent() {
  const params = useParams()
  const traderAddress = params.address as string
  const traders = useStore((state) => state.traders)
  const wallet = useStore((state) => state.wallet)
  const user = useStore((state) => state.user)

  const [trader, setTrader] = useState<Trader | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTraderData()
  }, [traderAddress])

  async function loadTraderData() {
    setIsLoading(true)

    const foundTrader = traders.find((t) => t.id === traderAddress || t.address === traderAddress)

    if (foundTrader) {
      setTrader(foundTrader)
    }

    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full mt-4" />
        <Skeleton className="h-96 w-full mt-4" />
      </div>
    )
  }

  if (!trader) {
    return (
      <div className="mx-auto max-w-4xl p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Trader not found</h2>
        <p className="text-muted-foreground">The trader you are looking for does not exist.</p>
      </div>
    )
  }

  const isOwnProfile = user?.address === trader.address || wallet.address === trader.address

  return (
    <div className="mx-auto max-w-4xl p-4">
      <ProfileHeader trader={trader} onUpdate={loadTraderData} isOwnProfile={isOwnProfile} />
      <ProfileStats trader={trader} />
      <ProfileTabs traderAddress={traderAddress} isOwnProfile={isOwnProfile} />
    </div>
  )
}

export default function TraderProfilePage() {
  return (
    <ProtectedRoute>
      <TraderProfilePageContent />
    </ProtectedRoute>
  )
}
