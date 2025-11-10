"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"
import { ImageIcon, Type, Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface CreateStoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateStoryModal({ open, onOpenChange }: CreateStoryModalProps) {
  const [storyType, setStoryType] = useState<"image" | "text">("image")
  const [imageUrl, setImageUrl] = useState("")
  const [textContent, setTextContent] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const createStory = useStore((state) => state.createStory)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateStory = () => {
    if (storyType === "image" && !imageUrl.trim()) {
      toast({ title: "Please add an image", variant: "destructive" })
      return
    }
    if (storyType === "text" && !textContent.trim()) {
      toast({ title: "Please add text content", variant: "destructive" })
      return
    }

    if (storyType === "image") {
      createStory("image", imageUrl, textContent)
    } else {
      createStory("text", textContent)
    }

    setImageUrl("")
    setTextContent("")
    setImageFile(null)
    onOpenChange(false)
    toast({ title: "Story created successfully!" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Story</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={storyType === "image" ? "default" : "outline"}
              onClick={() => setStoryType("image")}
              className="flex-1"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Image
            </Button>
            <Button
              variant={storyType === "text" ? "default" : "outline"}
              onClick={() => setStoryType("text")}
              className="flex-1"
            >
              <Type className="mr-2 h-4 w-4" />
              Text
            </Button>
          </div>

          {storyType === "image" ? (
            <>
              <div className="space-y-2">
                <Label>Upload Image</Label>
                <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose from device
                </Button>
                {imageUrl && (
                  <div className="mt-2">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full rounded-lg max-h-48 object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Caption (optional)</Label>
                <Textarea
                  placeholder="Add a caption..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={2}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label>Text Content</Label>
              <Textarea
                placeholder="Share your trading insights..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={6}
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleCreateStory} className="flex-1">
              Create Story
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
