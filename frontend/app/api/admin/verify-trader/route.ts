import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { verifyTrader } from "@/lib/stellar"

// POST /api/admin/verify-trader
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { adminAddress, traderAddress } = body

    // Verify admin permissions
    if (!adminAddress || !isAdmin(adminAddress)) {
      return NextResponse.json({ error: "Unauthorized: Admin permissions required" }, { status: 403 })
    }

    if (!traderAddress) {
      return NextResponse.json({ error: "Trader address is required" }, { status: 400 })
    }

    // Call Stellar smart contract to verify trader on-chain
    const result = await verifyTrader({
      adminAddress,
      traderAddress,
    })

    if (!result.success) {
      return NextResponse.json({ error: "Failed to verify trader on blockchain" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      txHash: result.txHash,
      message: "Trader verified successfully",
    })
  } catch (error) {
    console.error("[API] Verify trader error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
