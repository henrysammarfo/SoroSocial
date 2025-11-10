"use client"

import { ProfileHeader } from "@/components/profile-header"
import { ProfileStats } from "@/components/profile-stats"
import { ProfileTabs } from "@/components/profile-tabs"
import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"
import { ProtectedRoute } from "@/components/protected-route"

function ProfilePageContent() {
  const user = useStore((state) => state.user)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full mt-4" />
        <Skeleton className="h-96 w-full mt-4" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <ProfileHeader trader={user} isOwnProfile={true} />
      <ProfileStats trader={user} />
      <ProfileTabs traderAddress={user.address} isOwnProfile={true} />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  )
}
