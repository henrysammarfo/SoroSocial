"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

interface Story {
  id: string
  traderId: string
  trader: {
    displayName: string
    username: string
    avatar: string
    verified: boolean
  }
  type: "image" | "text"
  content: string // Image URL or text content
  text?: string // Optional text overlay for images
  timestamp: string
  views: number
}

interface StoryViewerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStoryId: string
  stories: Story[]
}

export function StoryViewerModal({ open, onOpenChange, initialStoryId, stories }: StoryViewerModalProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const index = stories.findIndex((s) => s.id === initialStoryId)
    setCurrentStoryIndex(index >= 0 ? index : 0)
    setProgress(0)
  }, [initialStoryId, stories])

  useEffect(() => {
    if (!open) return

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory()
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(timer)
  }, [open, currentStoryIndex])

  const currentStory = stories[currentStoryIndex]

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1)
      setProgress(0)
    } else {
      onOpenChange(false)
    }
  }

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1)
      setProgress(0)
    }
  }

  if (!currentStory) return null

  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const storyTime = new Date(timestamp)
    const diffMs = now.getTime() - storyTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `${diffMinutes}m ago`
    }
    return `${diffHours}h ago`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 bg-background/95 backdrop-blur-sm">
        <div className="flex gap-1 p-2">
          {stories.map((_, idx) => (
            <div key={idx} className="h-0.5 flex-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-100"
                style={{
                  width: idx < currentStoryIndex ? "100%" : idx === currentStoryIndex ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={currentStory.trader.avatar || "/placeholder.svg"}
                alt={currentStory.trader.displayName}
              />
              <AvatarFallback>{currentStory.trader.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-semibold">{currentStory.trader.displayName}</div>
              <div className="text-xs text-muted-foreground">{getRelativeTime(currentStory.timestamp)}</div>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-muted/50 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative min-h-[500px] flex items-center justify-center bg-muted/20">
          {currentStory.type === "image" ? (
            <div className="relative w-full h-[500px]">
              <Image
                src={currentStory.content || "/placeholder.svg"}
                alt={currentStory.text || "Story"}
                fill
                className="object-contain"
              />
              {currentStory.text && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/80 to-transparent">
                  <p className="text-lg font-semibold text-center">{currentStory.text}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center max-w-md">
              <p className="text-xl leading-relaxed">{currentStory.content}</p>
            </div>
          )}

          {/* Navigation */}
          {currentStoryIndex > 0 && (
            <button
              onClick={prevStory}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 hover:bg-muted/50 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {currentStoryIndex < stories.length - 1 && (
            <button
              onClick={nextStory}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-muted/50 rounded-full transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
