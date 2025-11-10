"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"
import { TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [postContent, setPostContent] = useState("")
  const [includesTrade, setIncludesTrade] = useState(false)
  const [tradeAsset, setTradeAsset] = useState("")
  const [tradeAction, setTradeAction] = useState<"BUY" | "SELL">("BUY")
  const [tradeAmount, setTradeAmount] = useState("")
  const [tradePrice, setTradePrice] = useState("")
  const createPost = useStore((state) => state.createPost)

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      toast({ title: "Please enter post content", variant: "destructive" })
      return
    }

    let trade = undefined
    if (includesTrade && tradeAsset && tradeAmount) {
      trade = {
        asset: tradeAsset,
        action: tradeAction,
        amount: Number.parseFloat(tradeAmount),
        price: Number.parseFloat(tradePrice) || 0,
        profit: 0,
        timestamp: new Date().toISOString(),
      }
    }

    createPost(postContent, trade)
    setPostContent("")
    setIncludesTrade(false)
    setTradeAsset("")
    setTradeAmount("")
    setTradePrice("")
    onOpenChange(false)
    toast({ title: "Post created successfully!" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Post Content</Label>
            <Textarea
              placeholder="Share your trading insights..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={includesTrade ? "default" : "outline"}
              size="sm"
              onClick={() => setIncludesTrade(!includesTrade)}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Include Trade Details
            </Button>
          </div>

          {includesTrade && (
            <div className="space-y-3 border rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Asset</Label>
                  <Input placeholder="XLM" value={tradeAsset} onChange={(e) => setTradeAsset(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select value={tradeAction} onValueChange={(v) => setTradeAction(v as "BUY" | "SELL")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUY">BUY</SelectItem>
                      <SelectItem value="SELL">SELL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (optional)</Label>
                  <Input
                    type="number"
                    placeholder="0.12"
                    value={tradePrice}
                    onChange={(e) => setTradePrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleCreatePost} className="flex-1">
              Post
            </Button>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
