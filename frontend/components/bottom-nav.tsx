"use client"

import { Home, Compass, TrendingUp, Wallet, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/trade", label: "Trade", icon: TrendingUp },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/profile", label: "Profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-[48px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
