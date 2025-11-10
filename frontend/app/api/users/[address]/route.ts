import { NextRequest, NextResponse } from "next/server"
import { getUserProfile } from "@/lib/api-client"

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address

    // Basic address validation
    if (!address || !address.startsWith("G") || address.length !== 56) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Stellar address format",
        },
        { status: 400 }
      )
    }

    const result = await getUserProfile(address)

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
        { status: 404 }
      )
    }
  } catch (error) {
    console.error("[API] Get user profile error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}