import { NextRequest, NextResponse } from "next/server"
import { executeTradeAPI } from "@/lib/api-client"
import { z } from "zod"

const executeTradeSchema = z.object({
  tokenIn: z.string().min(1),
  tokenOut: z.string().min(1),
  amountIn: z.number().positive(),
  minAmountOut: z.number().positive(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tokenIn, tokenOut, amountIn, minAmountOut } = executeTradeSchema.parse(body)

    const result = await executeTradeAPI(tokenIn, tokenOut, amountIn, minAmountOut)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Trade executed successfully",
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
    console.error("[API] Execute trade error:", error)

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