import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("Starting demo data seeding...")
    
    // Return mock data directly (no localStorage needed on server)
    const mockUsers = [
      {
        id: "1",
        address: "GB6BTGYP3V5E4VS3ENKLQMNZQZM6G7A5QTKZ4DQV7QB2FNBVYMKAS6NO",
        username: "@CryptoKing",
        displayName: "CryptoKing",
        bio: "Professional crypto trader with 5+ years experience. Expert in DeFi and yield farming.",
        reputation_score: 850,
        follower_count: 1247,
        following_count: 89,
        verified: true,
        avatar: "/professional-woman-trader.jpg",
        followers: 1247,
        following: 89,
        copiers: 892,
        totalReturn: 125.5,
        winRate: 78.5,
        avgReturn: 12.3,
        riskScore: 3.2,
        totalTrades: 245,
        successfulTrades: 192,
        portfolioValue: 50000,
        joinedDate: "2023-01-15T00:00:00Z",
        tags: ["DeFi", "Yield Farming", "Professional"]
      },
      {
        id: "2",
        address: "GB7H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
        username: "@DiamondHands",
        displayName: "DiamondHands",
        bio: "HODLing since 2017. Long-term investor focused on blue-chip cryptocurrencies.",
        reputation_score: 720,
        follower_count: 892,
        following_count: 156,
        verified: true,
        avatar: "/professional-man-trader.jpg",
        followers: 892,
        following: 156,
        copiers: 634,
        totalReturn: 89.2,
        winRate: 65.8,
        avgReturn: 8.7,
        riskScore: 2.1,
        totalTrades: 189,
        successfulTrades: 124,
        portfolioValue: 75000,
        joinedDate: "2023-02-10T00:00:00Z",
        tags: ["HODL", "Long-term", "Bitcoin"]
      },
      {
        id: "3",
        address: "GA8H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
        username: "@DeFiWhale",
        displayName: "DeFiWhale",
        bio: "DeFi protocols expert. Yield farming and liquidity mining specialist.",
        reputation_score: 915,
        follower_count: 2156,
        following_count: 234,
        verified: true,
        avatar: "/professional-asian-man.png",
        followers: 2156,
        following: 234,
        copiers: 1456,
        totalReturn: 234.8,
        winRate: 85.2,
        avgReturn: 18.9,
        riskScore: 4.5,
        totalTrades: 412,
        successfulTrades: 351,
        portfolioValue: 125000,
        joinedDate: "2023-03-05T00:00:00Z",
        tags: ["DeFi", "Yield Farming", "Liquidity Mining"]
      },
      {
        id: "4",
        address: "GB9H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
        username: "@TechTrader",
        displayName: "TechTrader",
        bio: "Technical analysis and algorithmic trading. Building the future of finance.",
        reputation_score: 680,
        follower_count: 734,
        following_count: 98,
        verified: false,
        avatar: "/professional-asian-woman.png",
        followers: 734,
        following: 98,
        copiers: 423,
        totalReturn: 67.3,
        winRate: 72.1,
        avgReturn: 9.8,
        riskScore: 3.8,
        totalTrades: 156,
        successfulTrades: 112,
        portfolioValue: 35000,
        joinedDate: "2023-04-20T00:00:00Z",
        tags: ["Technical Analysis", "Algorithmic", "Trading"]
      },
      {
        id: "5",
        address: "GC9H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
        username: "@AltcoinGuru",
        displayName: "AltcoinGuru",
        bio: "Discovering hidden gems in the altcoin market. Follow for early gem alerts!",
        reputation_score: 540,
        follower_count: 456,
        following_count: 321,
        verified: false,
        avatar: "/professional-woman-finance.png",
        followers: 456,
        following: 321,
        copiers: 234,
        totalReturn: 45.6,
        winRate: 58.9,
        avgReturn: 6.2,
        riskScore: 4.8,
        totalTrades: 98,
        successfulTrades: 58,
        portfolioValue: 25000,
        joinedDate: "2023-05-30T00:00:00Z",
        tags: ["Altcoins", "Gems", "Early Stage"]
      }
    ]

    const mockTrades = [
      {
        id: "1",
        trade_id: "TRD_001",
        trader_address: "GB6BTGYP3V5E4VS3ENKLQMNZQZM6G7A5QTKZ4DQV7QB2FNBVYMKAS6NO",
        token_in: "XLM",
        token_out: "USDC",
        amount_in: "1000.00",
        amount_out: "995.50",
        min_amount_out: "990.00",
        pnl: "15.50",
        status: "completed",
        timestamp: "2024-11-10T01:30:00Z"
      },
      {
        id: "2",
        trade_id: "TRD_002", 
        trader_address: "GB7H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
        token_in: "BTC",
        token_out: "XLM", 
        amount_in: "0.1",
        amount_out: "1250.00",
        min_amount_out: "1200.00",
        pnl: "2.3",
        status: "completed",
        timestamp: "2024-11-10T00:45:00Z"
      },
      {
        id: "3",
        trade_id: "TRD_003",
        trader_address: "GA8H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
        token_in: "ETH",
        token_out: "USDC",
        amount_in: "2.5", 
        amount_out: "5750.00",
        min_amount_out: "5700.00",
        pnl: "125.00",
        status: "completed",
        timestamp: "2024-11-10T00:15:00Z"
      }
    ]

    return NextResponse.json({
      success: true,
      message: "Demo data is ready!",
      data: {
        users_created: mockUsers.length,
        trades_created: mockTrades.length,
        demo_data: {
          users: mockUsers,
          trades: mockTrades
        },
        message: "Demo data available via API - frontend will use this data"
      }
    })
    
  } catch (error) {
    console.error("[API] Demo seed error:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Demo seeding failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return current demo data status
    return NextResponse.json({
      success: true,
      data: {
        hasData: true,
        message: "Demo data is always available",
        storage: "API"
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to check status"
    })
  }
}