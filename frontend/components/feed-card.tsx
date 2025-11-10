"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Copy, TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CommentModal } from "./comment-modal"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"
import type { FeedPost } from "@/lib/types"
import { PostOptionsMenu } from "./post-options-menu"

interface FeedCardProps {
  data: FeedPost
}

export function FeedCard({ data }: FeedCardProps) {
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const isProfitable = data.trade ? data.trade.profit > 0 : true
  const router = useRouter()
  const { toast } = useToast()
  const { comments, user } = useStore()
  const isOwnPost = user?.id === data.trader.id

  const handleLike = async () => {
    const newLiked = !liked
    setLiked(newLiked)

    toast({
      title: newLiked ? "Liked!" : "Unliked",
      description: newLiked ? "Post added to your likes" : "Post removed from your likes",
    })
  }

  const handleCopy = () => {
    const newCopied = !copied
    setCopied(newCopied)

    if (newCopied) {
      router.push(`/trade?trader=${data.trader.username}`)
    }
  }

  const handleTraderClick = () => {
    router.push(`/trader/${data.trader.address}`)
  }

  const tradeComments = comments?.[data.id] || []

  return (
    <>
      <Card className="border-0 border-b border-border rounded-none shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3">
          <button onClick={handleTraderClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="h-10 w-10">
              <AvatarImage src={data.trader.avatar || "/placeholder.svg"} alt={data.trader.displayName} />
              <AvatarFallback>{data.trader.displayName?.[0] || data.trader.username?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold">{data.trader.displayName}</span>
                {data.trader.verified && <CheckCircle2 className="h-4 w-4 fill-primary text-primary-foreground" />}
              </div>
              <span className="text-xs text-muted-foreground">{data.trader.username}</span>
            </div>
          </button>
          <PostOptionsMenu postId={data.id} isOwnPost={isOwnPost} />
        </div>

        {data.trade && (
          <div className="mx-4 mb-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant={data.trade.action === "BUY" ? "default" : "secondary"}
                  className={cn(
                    "font-semibold",
                    data.trade.action === "BUY"
                      ? "bg-success text-success-foreground"
                      : "bg-destructive text-destructive-foreground",
                  )}
                >
                  {data.trade.action}
                </Badge>
                <span className="text-2xl font-bold">{data.trade.asset}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Price</div>
                <div className="text-lg font-semibold">
                  {data.trade.price > 0 ? `$${data.trade.price.toFixed(2)}` : `${data.trade.amount} tokens`}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Amount</div>
                <div className="text-sm font-medium">{data.trade.amount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">P&L</div>
                <div
                  className={cn(
                    "text-sm font-semibold flex items-center gap-1",
                    isProfitable ? "text-success" : "text-destructive",
                  )}
                >
                  {isProfitable ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {data.trade.profit > 0 ? "+" : ""}
                  {data.trade.profit.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <div className={cn("text-sm font-semibold", isProfitable ? "text-success" : "text-muted-foreground")}>
                  {data.trade.action}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 px-4 pb-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-9 gap-2", liked && "text-destructive")}
            onClick={handleLike}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-current")} />
            <span className="text-sm font-medium">{data.likes + (liked ? 1 : 0)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-9 gap-2" onClick={() => setShowComments(true)}>
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{data.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className={cn("h-9 gap-2", copied && "text-primary")} onClick={handleCopy}>
            <Copy className="h-5 w-5" />
            <span className="text-sm font-medium">{data.shares + (copied ? 1 : 0)}</span>
          </Button>
        </div>

        {/* Caption */}
        <div className="px-4 pb-4">
          <p className="text-sm">
            <button onClick={handleTraderClick} className="font-semibold mr-2 hover:underline">
              {data.trader.username}
            </button>
            {data.content}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">{new Date(data.timestamp).toLocaleString()}</span>
        </div>
      </Card>

      {/* Comment Modal */}
      <CommentModal open={showComments} onOpenChange={setShowComments} postId={data.id} comments={tradeComments} />
    </>
  )
}
