"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, TrendingUp, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CreatePostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPosting, setIsPosting] = useState(false)
  const [postData, setPostData] = useState({
    caption: "",
    tradeSymbol: "",
    tradeType: "BUY",
    price: "",
    quantity: "",
  })

  async function handlePost() {
    if (!postData.caption && !postData.tradeSymbol) {
      toast({
        title: "Error",
        description: "Please add a caption or trade details",
        variant: "destructive",
      })
      return
    }

    setIsPosting(true)

    // TODO: Integrate with Soroban contract - create_post(caption, trade_details)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Post created!",
      description: "Your post has been shared with your followers",
    })

    setIsPosting(false)
    router.push("/app")
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Create Post</h1>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="caption">Caption</Label>
          <Textarea
            id="caption"
            placeholder="Share your trading insights..."
            rows={4}
            value={postData.caption}
            onChange={(e) => setPostData({ ...postData, caption: e.target.value })}
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Add Trade Details (Optional)
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="AAPL"
                value={postData.tradeSymbol}
                onChange={(e) => setPostData({ ...postData, tradeSymbol: e.target.value.toUpperCase() })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={postData.tradeType}
                onValueChange={(value) => setPostData({ ...postData, tradeType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">Buy</SelectItem>
                  <SelectItem value="SELL">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  className="pl-9"
                  value={postData.price}
                  onChange={(e) => setPostData({ ...postData, price: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={postData.quantity}
                onChange={(e) => setPostData({ ...postData, quantity: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handlePost} disabled={isPosting}>
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
