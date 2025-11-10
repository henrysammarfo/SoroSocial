"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  if (isLandingPage) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <>
      <AppHeader />
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <DesktopSidebar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
      </div>
      <BottomNav />
    </>
  )
}
