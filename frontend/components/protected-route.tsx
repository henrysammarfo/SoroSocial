"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const router = useRouter()
  const wallet = useStore((state) => state.wallet)
  const isAuthenticated = useStore((state) => state.isAuthenticated)
  const needsProfileSetup = useStore((state) => state.needsProfileSetup)

  useEffect(() => {
    if (requireAuth) {
      if (!wallet.connected) {
        router.push("/")
        return
      }

      if (needsProfileSetup) {
        router.push("/setup-profile")
        return
      }

      if (!isAuthenticated) {
        router.push("/setup-profile")
        return
      }
    }
  }, [wallet.connected, isAuthenticated, needsProfileSetup, requireAuth, router])

  if (requireAuth && (!wallet.connected || !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
