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

export function DesktopSidebar() {
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border">
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
