import { NextRequest, NextResponse } from "next/server"
import { createUserProfile } from "@/lib/api-client"
import { z } from "zod"

const createUserSchema = z.object({
  username: z.string().min(1).max(50),
  bio: z.string().max(500).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, bio } = createUserSchema.parse(body)

    const result = await createUserProfile(username, bio || "")

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[API] Create user error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}