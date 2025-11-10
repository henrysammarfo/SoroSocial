"use client"

import { Search, Bell, Moon, Sun, ImagePlus, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { CreateStoryModal } from "@/components/create-story-modal"
import { SearchModal } from "@/components/search-modal"
import { useStore } from "@/lib/store"
import { isAdmin } from "@/lib/admin"

export function AppHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showCreateStory, setShowCreateStory] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isLandingPage = pathname === "/"

  const wallet = useStore((state) => state.wallet)
  const isUserAdmin = wallet.connected && wallet.address ? isAdmin(wallet.address) : false

  useEffect(() => {
    setMounted(true)
  }, [])

  if (isLandingPage) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">T</span>
            </div>
            <span className="text-lg font-semibold">TradeSocial</span>
          </Link>

          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
            <Button variant="default" size="sm" asChild>
              <Link href="/app">Launch App</Link>
            </Button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/app" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">T</span>
            </div>
            <span className="text-lg font-semibold">TradeSocial</span>
          </Link>

          <div className="flex items-center gap-2">
            {isUserAdmin && (
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                <Link href="/admin">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowCreateStory(true)}
              title="Create Story"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="sr-only">Create story</span>
            </Button>

            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setShowSearch(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
              <span className="sr-only">Notifications</span>
            </Button>
            <WalletConnectButton />
          </div>
        </div>
      </header>

      <CreateStoryModal open={showCreateStory} onOpenChange={setShowCreateStory} />
      <SearchModal open={showSearch} onOpenChange={setShowSearch} />
    </>
  )
}
