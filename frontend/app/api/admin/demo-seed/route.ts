import { NextRequest, NextResponse } from "next/server"
import { seedDemoData, clearDemoData, hasDemoData } from "@/lib/demo-data"

// Admin check - In production, this would verify admin privileges
function isAdminRequest(request: NextRequest): boolean {
  // For demo purposes, allow any request
  // In production, verify admin token/JWT
  return true
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log("[API] Seeding demo data...")
    
    const result = await seedDemoData()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: result.data
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[API] Demo seed error:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed demo data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log("[API] Clearing demo data...")
    
    const result = await clearDemoData()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[API] Demo clear error:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear demo data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const hasData = await hasDemoData()
    
    return NextResponse.json({
      success: true,
      data: {
        hasDemoData: hasData,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("[API] Demo check error:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check demo data status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}