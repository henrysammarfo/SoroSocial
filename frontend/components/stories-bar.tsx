"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useState } from "react"
import { StoryViewerModal } from "./story-viewer-modal"
import { useStore } from "@/lib/store"

export function StoriesBar() {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null)
  const stories = useStore((state) => state.stories)

  return (
    <>
      <div className="border-b border-border bg-card">
        <ScrollArea className="w-full">
          <div className="flex gap-4 p-4">
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => setSelectedStoryId(story.id)}
                className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-80"
              >
                <div className="relative">
                  <div className="rounded-full bg-gradient-to-tr from-primary via-chart-1 to-chart-2 p-0.5">
                    <div className="rounded-full bg-card p-0.5">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={story.trader.avatar || "/placeholder.svg"} alt={story.trader.displayName} />
                        <AvatarFallback>{story.trader.displayName[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground max-w-[64px] truncate">
                  {story.trader.displayName.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {selectedStoryId && (
        <StoryViewerModal
          open={selectedStoryId !== null}
          onOpenChange={(open) => !open && setSelectedStoryId(null)}
          initialStoryId={selectedStoryId}
          stories={stories}
        />
      )}
    </>
  )
}
