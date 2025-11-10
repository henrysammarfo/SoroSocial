"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Bookmark, Flag, Link2, Trash2, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PostOptionsMenuProps {
  postId: string
  isOwnPost?: boolean
}

export function PostOptionsMenu({ postId, isOwnPost }: PostOptionsMenuProps) {
  const { toast } = useToast()

  const handleSavePost = () => {
    toast({ title: "Post saved", description: "Added to your saved posts" })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)
    toast({ title: "Link copied", description: "Post link copied to clipboard" })
  }

  const handleReport = () => {
    toast({ title: "Post reported", description: "Thank you for helping keep our community safe" })
  }

  const handleDelete = () => {
    toast({ title: "Post deleted", description: "The post has been removed" })
  }

  const handleEdit = () => {
    toast({ title: "Edit post", description: "Opening editor..." })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {isOwnPost ? (
          <>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete post
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={handleSavePost}>
              <Bookmark className="mr-2 h-4 w-4" />
              Save post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReport}>
              <Flag className="mr-2 h-4 w-4" />
              Report
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={handleCopyLink}>
          <Link2 className="mr-2 h-4 w-4" />
          Copy link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
