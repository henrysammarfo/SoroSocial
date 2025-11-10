// SoroSocial Demo Data Seeding
// This module handles creating realistic demo data for the hackathon

import { supabase } from './api-client'
import { UserProfile, Trader, Trade, ActiveCopyTrade } from './types'

// Demo trader profiles with realistic data
export const DEMO_TRADERS: Array<{
  address: string
  username: string
  displayName: string
  bio: string
  avatar: string
  verified: boolean
  reputation: number
  stats: {
    totalTrades: number
    winRate: number
    totalReturn: number
    followers: number
    copiers: number
  }
}> = [
  {
    address: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    username: "sarah_trader",
    displayName: "Sarah Chen",
    bio: "Professional crypto trader with 5+ years experience. Specializing in DeFi and yield farming strategies.",
    avatar: "/professional-asian-woman.png",
    verified: true,
    reputation: 850,
    stats: {
      totalTrades: 150,
      winRate: 78,
      totalReturn: 245.5,
      followers: 1240,
      copiers: 89
    }
  },
  {
    address: "GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    username: "mike_defi",
    displayName: "Mike Rodriguez",
    bio: "DeFi specialist and yield farming expert. Building passive income through decentralized finance.",
    avatar: "/professional-latino-man-trader.jpg",
    verified: true,
    reputation: 780,
    stats: {
      totalTrades: 200,
      winRate: 72,
      totalReturn: 189.3,
      followers: 856,
      copiers: 67
    }
  },
  {
    address: "GCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    username: "alex_scalper",
    displayName: "Alex Thompson",
    bio: "High-frequency trading and scalping strategies. Quick profits in volatile markets.",
    avatar: "/professional-man-trader.jpg",
    verified: false,
    reputation: 720,
    stats: {
      totalTrades: 320,
      winRate: 65,
      totalReturn: 156.7,
      followers: 543,
      copiers: 34
    }
  },
  {
    address: "GDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
    username: "jenny_hodl",
    displayName: "Jennifer Walsh",
    bio: "Long-term investor and Bitcoin maximalist. HODLing through the storms since 2017.",
    avatar: "/professional-woman-trader.jpg",
    verified: false,
    reputation: 650,
    stats: {
      totalTrades: 50,
      winRate: 88,
      totalReturn: 312.1,
      followers: 2103,
      copiers: 156
    }
  },
  {
    address: "GEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
    username: "david_tech",
    displayName: "David Kim",
    bio: "Tech analyst focusing on altcoins and emerging blockchain projects. Research-driven trading.",
    avatar: "/professional-asian-man.png",
    verified: false,
    reputation: 590,
    stats: {
      totalTrades: 80,
      winRate: 70,
      totalReturn: 134.2,
      followers: 432,
      copiers: 28
    }
  }
]

// Demo trades with realistic data
export const generateDemoTrades = (traderAddresses: string[]) => {
  const tokens = ["XLM", "USDC", "ETH", "BTC", "ADA", "SOL", "DOT", "MATIC", "AVAX", "LINK"]
  const actions = ["BUY", "SELL", "HOLD"]
  const statuses = ["pending", "executed", "failed"]
  
  const trades = []
  const now = Date.now()
  
  for (let i = 0; i < 50; i++) {
    const traderAddress = traderAddresses[Math.floor(Math.random() * traderAddresses.length)]
    const tokenIn = tokens[Math.floor(Math.random() * tokens.length)]
    const tokenOut = tokens[Math.floor(Math.random() * tokens.length)]
    const amountIn = Math.random() * 10000 + 100 // $100 - $10,100
    const profit = (Math.random() - 0.45) * amountIn * 0.15 // -6.75% to +8.25%
    
    trades.push({
      trade_id: `demo_trade_${Date.now()}_${i}`,
      trader_address: traderAddress,
      token_in: tokenIn,
      token_out: tokenOut,
      amount_in: Math.round(amountIn * 100) / 100,
      amount_out: Math.round((amountIn + profit) * 100) / 100,
      min_amount_out: Math.round(amountIn * 0.95 * 100) / 100,
      pnl: Math.round(profit * 100) / 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Demo social posts
export const generateDemoPosts = (traderAddresses: string[], trades: any[]) => {
  const postTemplates = [
    "Just executed a profitable trade! {asset} looking strong 💪",
    "Market analysis suggests {direction} momentum for {asset}",
    "Risk management is key in crypto trading. Remember to set stop losses!",
    "DeFi yields are looking great this week. Where are you farming?",
    "Another successful scalping session. Quick profits add up! 📈",
    "HODLing strong through the volatility. Patient profits 💎",
    "Technical analysis shows {asset} breaking resistance. Targets ahead!",
    "Remember: Never invest more than you can afford to lose!",
    "Copy trading tip: Diversify across multiple successful traders",
    "Bull run incoming? Preparing my portfolio for the next cycle 🚀"
  ]
  
  const assets = ["BTC", "ETH", "SOL", "ADA", "XLM"]
  const directions = ["bullish", "bearish", "sideways"]
  
  const posts = []
  
  for (let i = 0; i < 30; i++) {
    const traderAddress = traderAddresses[Math.floor(Math.random() * traderAddresses.length)]
    const template = postTemplates[Math.floor(Math.random() * postTemplates.length)]
    const asset = assets[Math.floor(Math.random() * assets.length)]
    const direction = directions[Math.floor(Math.random() * directions.length)]
    
    let content = template
      .replace('{asset}', asset)
      .replace('{direction}', direction)
    
    posts.push({
      id: `demo_post_${Date.now()}_${i}`,
      user_address: traderAddress,
      content: content,
      trade_id: Math.random() > 0.7 ? trades[Math.floor(Math.random() * trades.length)]?.id : null,
      likes_count: Math.floor(Math.random() * 100),
      comments_count: Math.floor(Math.random() * 20),
      shares_count: Math.floor(Math.random() * 10),
      created_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

// Demo performance metrics
export const generateDemoMetrics = (traderAddresses: string[]) => {
  return traderAddresses.map((address, index) => {
    const trader = DEMO_TRADERS[index]
    const totalVolume = trader.stats.totalTrades * (Math.random() * 5000 + 1000)
    
    return {
      trader_address: address,
      total_trades: trader.stats.totalTrades,
      profitable_trades: Math.floor(trader.stats.totalTrades * trader.stats.winRate / 100),
      total_volume: Math.round(totalVolume * 100) / 100,
      total_pnl: Math.round(totalVolume * trader.stats.totalReturn / 100 * 100) / 100,
      max_drawdown: Math.round(-totalVolume * (Math.random() * 0.1 + 0.02) * 100) / 100,
      win_rate: trader.stats.winRate,
      reputation_score: trader.reputation,
      updated_at: new Date().toISOString()
    }
  })
}

// Demo follows (social graph)
export const generateDemoFollows = (traderAddresses: string[]) => {
  const follows = []
  
  for (let i = 0; i < traderAddresses.length; i++) {
    for (let j = 0; j < traderAddresses.length; j++) {
      if (i !== j && Math.random() > 0.6) { // 40% chance of following
        follows.push({
          follower_address: traderAddresses[i],
          following_address: traderAddresses[j],
          copy_enabled: Math.random() > 0.7, // 30% have copy enabled
          allocation_percent: [25, 50, 75, 100][Math.floor(Math.random() * 4)],
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        })
      }
    }
  }
  
  return follows
}

// Demo notifications
export const generateDemoNotifications = (traderAddresses: string[]) => {
  const notificationTypes = [
    { type: "new_follower", title: "New Follower", message: "Someone started following you" },
    { type: "trade_copied", title: "Trade Copied", message: "Your trade was copied by a follower" },
    { type: "copy_profit", title: "Copy Profit", message: "Your copy trade is now profitable" },
    { type: "milestone", title: "Achievement Unlocked", message: "You've reached a new trading milestone" },
    { type: "market_alert", title: "Market Alert", message: "Significant market movement detected" }
  ]
  
  const notifications = []
  
  for (let i = 0; i < 100; i++) {
    const traderAddress = traderAddresses[Math.floor(Math.random() * traderAddresses.length)]
    const notificationType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
    
    notifications.push({
      user_address: traderAddress,
      type: notificationType.type,
      title: notificationType.title,
      message: notificationType.message,
      data: {},
      read: Math.random() > 0.3, // 70% are read
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

// Main seeding function
export async function seedDemoData() {
  try {
    console.log("🌱 Starting demo data seeding...")
    
    // Check if demo data already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('address')
      .limit(1)
    
    if (existingUsers && existingUsers.length > 0) {
      console.log("⚠️  Demo data already exists. Skipping seeding.")
      return { success: true, message: "Demo data already exists" }
    }
    
    // Insert demo users
    console.log("👥 Seeding users...")
    const userInserts = DEMO_TRADERS.map(trader => ({
      address: trader.address,
      username: trader.username,
      bio: trader.bio,
      reputation_score: trader.reputation,
      follower_count: trader.stats.followers,
      following_count: Math.floor(trader.stats.followers * 0.1),
      verified: trader.verified,
      avatar_url: trader.avatar,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }))
    
    const { error: userError } = await supabase
      .from('users')
      .insert(userInserts)
    
    if (userError) throw userError
    
    // Insert demo trades
    console.log("📈 Seeding trades...")
    const traderAddresses = DEMO_TRADERS.map(t => t.address)
    const demoTrades = generateDemoTrades(traderAddresses)
    
    const { error: tradesError } = await supabase
      .from('trades')
      .insert(demoTrades)
    
    if (tradesError) throw tradesError
    
    // Insert demo posts
    console.log("📝 Seeding posts...")
    const demoPosts = generateDemoPosts(traderAddresses, demoTrades)
    
    const { error: postsError } = await supabase
      .from('posts')
      .insert(demoPosts)
    
    if (postsError) throw postsError
    
    // Insert demo performance metrics
    console.log("📊 Seeding performance metrics...")
    const demoMetrics = generateDemoMetrics(traderAddresses)
    
    const { error: metricsError } = await supabase
      .from('performance_metrics')
      .insert(demoMetrics)
    
    if (metricsError) throw metricsError
    
    // Insert demo follows
    console.log("👥 Seeding follows...")
    const demoFollows = generateDemoFollows(traderAddresses)
    
    const { error: followsError } = await supabase
      .from('follows')
      .insert(demoFollows)
    
    if (followsError) throw followsError
    
    // Insert demo notifications
    console.log("🔔 Seeding notifications...")
    const demoNotifications = generateDemoNotifications(traderAddresses)
    
    const { error: notificationsError } = await supabase
      .from('notifications')
      .insert(demoNotifications)
    
    if (notificationsError) throw notificationsError
    
    // Add activity feed entries
    console.log("⚡ Seeding activity feed...")
    const activityFeed = []
    
    for (const post of demoPosts.slice(0, 20)) {
      activityFeed.push({
        user_address: post.user_address,
        type: 'post',
        content: { post_id: post.id, content: post.content },
        created_at: post.created_at
      })
    }
    
    for (const trade of demoTrades.slice(0, 20)) {
      activityFeed.push({
        user_address: trade.trader_address,
        type: 'trade',
        content: { 
          trade_id: trade.trade_id, 
          token_in: trade.token_in, 
          token_out: trade.token_out,
          amount_in: trade.amount_in,
          pnl: trade.pnl
        },
        created_at: trade.timestamp
      })
    }
    
    const { error: activityError } = await supabase
      .from('activity_feed')
      .insert(activityFeed)
    
    if (activityError) throw activityError
    
    console.log("✅ Demo data seeding completed successfully!")
    
    return {
      success: true,
      message: "Demo data seeded successfully",
      data: {
        users: DEMO_TRADERS.length,
        trades: demoTrades.length,
        posts: demoPosts.length,
        metrics: demoMetrics.length,
        follows: demoFollows.length,
        notifications: demoNotifications.length,
        activity: activityFeed.length
      }
    }
    
  } catch (error) {
    console.error("❌ Demo data seeding failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

// Clear demo data
export async function clearDemoData() {
  try {
    console.log("🧹 Clearing demo data...")
    
    // Clear in reverse order of dependencies
    await supabase.from('activity_feed').delete().neq('id', '')
    await supabase.from('notifications').delete().neq('id', '')
    await supabase.from('follows').delete().neq('id', '')
    await supabase.from('performance_metrics').delete().neq('id', '')
    await supabase.from('posts').delete().neq('id', '')
    await supabase.from('trades').delete().neq('id', '')
    await supabase.from('users').delete().neq('id', '')
    
    console.log("✅ Demo data cleared successfully!")
    
    return { success: true, message: "Demo data cleared successfully" }
    
  } catch (error) {
    console.error("❌ Failed to clear demo data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

// Check if demo data exists
export async function hasDemoData(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('address')
      .limit(1)
    
    return !error && data && data.length > 0
  } catch (error) {
    console.error("Error checking demo data:", error)
    return false
  }
}