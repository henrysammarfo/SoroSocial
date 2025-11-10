import { NextRequest, NextResponse } from "next/server"
import { followTrader } from "@/lib/api-client"
import { z } from "zod"

const followSchema = z.object({
  targetAddress: z.string().regex(/^G[A-Z0-9]{55}$/, "Invalid Stellar address"),
  enableCopy: z.boolean().optional().default(false),
  allocationPercent: z.number().min(0).max(100).optional().default(100),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { targetAddress, enableCopy, allocationPercent } = followSchema.parse(body)

    const result = await followTrader(targetAddress, enableCopy, allocationPercent)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Successfully followed trader",
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
    console.error("[API] Follow trader error:", error)

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