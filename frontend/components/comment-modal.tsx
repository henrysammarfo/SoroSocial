"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"

interface Comment {
  id: string
  user: {
    name: string
    username: string
    avatar: string
  }
  text: string
  timestamp: string
  likes: number
}

interface CommentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
}

export function CommentModal({ open, onOpenChange, postId }: CommentModalProps) {
  const feed = useStore((state) => state.feed)
  const user = useStore((state) => state.user)
  const post = feed.find((p) => p.id === postId)

  const generateCommentsForPost = (postId: string, count: number): Comment[] => {
    const commenters = [
      { name: "John Doe", username: "@johndoe", avatar: "/placeholder.svg?height=40&width=40&text=JD" },
      { name: "Jane Smith", username: "@janesmith", avatar: "/placeholder.svg?height=40&width=40&text=JS" },
      { name: "Mike Chen", username: "@mikechen", avatar: "/placeholder.svg?height=40&width=40&text=MC" },
      { name: "Sarah Williams", username: "@sarahw", avatar: "/placeholder.svg?height=40&width=40&text=SW" },
      { name: "David Brown", username: "@davidb", avatar: "/placeholder.svg?height=40&width=40&text=DB" },
    ]

    const commentTexts = [
      "Great trade! Following your strategy 🚀",
      "What's your target price for this?",
      "How do you analyze these entries?",
      "Been copying your trades for a month, great results!",
      "Do you think it will continue this trend?",
      "Nice profit! What's your stop loss?",
      "Love your analysis, keep it up!",
      "How long are you holding this position?",
    ]

    return Array.from({ length: count }, (_, i) => ({
      id: `${postId}-comment-${i}`,
      user: commenters[i % commenters.length],
      text: commentTexts[i % commentTexts.length],
      timestamp: `${Math.floor(Math.random() * 24)}h ago`,
      likes: Math.floor(Math.random() * 20),
    }))
  }

  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open && post) {
      const initialComments = generateCommentsForPost(postId, post.comments || 5)
      setComments(initialComments)
    }
  }, [open, postId, post])

  const handleSubmit = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: user?.displayName || "Anonymous",
        username: user?.username || "@user",
        avatar: user?.avatar || "/placeholder.svg",
      },
      text: newComment,
      timestamp: "Just now",
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment("")
    setIsSubmitting(false)

    toast({
      title: "Comment posted",
      description: "Your comment has been added successfully",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{comment.user.username}</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm mt-1">{comment.text}</p>
                    <Button variant="ghost" size="sm" className="h-7 px-2 mt-1">
                      <Heart className="h-3 w-3 mr-1" />
                      <span className="text-xs">{comment.likes}</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
            />
            <Button onClick={handleSubmit} disabled={!newComment.trim() || isSubmitting}>
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
