"use client"

import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { isAdmin } from "@/lib/admin"

export function AdminAccessButton() {
  const wallet = useStore((state) => state.wallet)

  if (!wallet.connected || !wallet.address || !isAdmin(wallet.address)) {
    return null
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/admin">
        <Shield className="h-4 w-4 mr-2" />
        Admin Panel
      </Link>
    </Button>
  )
}
