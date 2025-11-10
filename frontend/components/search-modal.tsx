"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp } from "lucide-react"
import { useStore } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const traders = useStore((state) => state.traders)
  const router = useRouter()

  const filteredTraders = query
    ? traders.filter(
        (trader) =>
          trader.displayName.toLowerCase().includes(query.toLowerCase()) ||
          trader.username.toLowerCase().includes(query.toLowerCase()) ||
          trader.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      )
    : traders.slice(0, 10)

  const handleTraderClick = (traderId: string) => {
    router.push(`/trader/${traderId}`)
    onOpenChange(false)
    setQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Traders</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, username, or strategy..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredTraders.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No traders found</div>
            ) : (
              filteredTraders.map((trader) => (
                <div
                  key={trader.id}
                  onClick={() => handleTraderClick(trader.id)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={trader.avatar || "/placeholder.svg"} alt={trader.displayName} />
                    <AvatarFallback>{trader.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{trader.displayName}</span>
                      {trader.verified && (
                        <Badge variant="secondary" className="h-4 px-1 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{trader.username}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-success">
                    <TrendingUp className="h-4 w-4" />+{trader.totalReturn}%
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
