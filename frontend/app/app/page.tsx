"use client"

import { FeedCard } from "@/components/feed-card"
import { StoriesBar } from "@/components/stories-bar"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { CreatePostModal } from "@/components/create-post-modal"

function FeedPageContent() {
  const feed = useStore((state) => state.feed)
  const user = useStore((state) => state.user)
  const createPost = useStore((state) => state.createPost)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [postContent, setPostContent] = useState("")

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      // toast({ title: "Please enter post content", variant: "destructive" })
      return
    }

    createPost(postContent)
    setPostContent("")
    setShowCreatePost(false)
    // toast({ title: "Post created successfully!" })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <StoriesBar />

      {user && (
        <div className="p-4 border-b border-border">
          <Button onClick={() => setShowCreatePost(true)} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>
      )}

      <div className="divide-y divide-border">
        {feed.map((item) => (
          <FeedCard key={item.id} data={item} />
        ))}
      </div>

      <CreatePostModal open={showCreatePost} onOpenChange={setShowCreatePost} />
    </div>
  )
}

export default function FeedPage() {
  return (
    <ProtectedRoute>
      <FeedPageContent />
    </ProtectedRoute>
  )
}
