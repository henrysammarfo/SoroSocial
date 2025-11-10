// Mock data for demo purposes - uses localStorage instead of database
export interface MockUser {
  id: string
  address: string
  username: string
  bio: string
  reputation_score: number
  follower_count: number
  following_count: number
  verified: boolean
  avatar_url: string
  created_at: string
}

export interface MockTrade {
  id: string
  trade_id: string
  trader_address: string
  token_in: string
  token_out: string
  amount_in: string
  amount_out: string
  min_amount_out: string
  pnl: string
  status: string
  timestamp: string
}

export interface MockPost {
  id: string
  user_address: string
  content: string
  trade_id?: string
  likes_count: number
  comments_count: number
  shares_count: number
  created_at: string
}

export interface MockFollow {
  id: string
  follower_address: string
  following_address: string
  copy_enabled: boolean
  allocation_percent: number
  created_at: string
}

const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    address: "GB6BTGYP3V5E4VS3ENKLQMNZQZM6G7A5QTKZ4DQV7QB2FNBVYMKAS6NO",
    username: "CryptoKing",
    bio: "Professional crypto trader with 5+ years experience. Expert in DeFi and yield farming.",
    reputation_score: 850,
    follower_count: 1247,
    following_count: 89,
    verified: true,
    avatar_url: "/professional-woman-trader.jpg",
    created_at: "2023-01-15T00:00:00Z"
  },
  {
    id: "2", 
    address: "GB7H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
    username: "DiamondHands",
    bio: "HODLing since 2017. Long-term investor focused on blue-chip cryptocurrencies.",
    reputation_score: 720,
    follower_count: 892,
    following_count: 156,
    verified: true,
    avatar_url: "/professional-man-trader.jpg",
    created_at: "2023-02-10T00:00:00Z"
  },
  {
    id: "3",
    address: "GA8H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9", 
    username: "DeFiWhale",
    bio: "DeFi protocols expert. Yield farming and liquidity mining specialist.",
    reputation_score: 915,
    follower_count: 2156,
    following_count: 234,
    verified: true,
    avatar_url: "/professional-asian-man.png",
    created_at: "2023-03-05T00:00:00Z"
  },
  {
    id: "4",
    address: "GB9H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
    username: "TechTrader", 
    bio: "Technical analysis and algorithmic trading. Building the future of finance.",
    reputation_score: 680,
    follower_count: 734,
    following_count: 98,
    verified: false,
    avatar_url: "/professional-asian-woman.png",
    created_at: "2023-04-20T00:00:00Z"
  },
  {
    id: "5",
    address: "GC9H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
    username: "AltcoinGuru",
    bio: "Discovering hidden gems in the altcoin market. Follow for early gem alerts!",
    reputation_score: 540,
    follower_count: 456,
    following_count: 321,
    verified: false,
    avatar_url: "/professional-woman-finance.png",
    created_at: "2023-05-30T00:00:00Z"
  }
]

const MOCK_TRADES: MockTrade[] = [
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

const MOCK_POSTS: MockPost[] = [
  {
    id: "1",
    user_address: "GB6BTGYP3V5E4VS3ENKLQMNZQZM6G7A5QTKZ4DQV7QB2FNBVYMKAS6NO",
    content: "Just executed a profitable XLM → USDC trade! 1.5% gain in this market 📈 #StellarTrading",
    trade_id: "TRD_001",
    likes_count: 23,
    comments_count: 5,
    shares_count: 3,
    created_at: "2024-11-10T01:35:00Z"
  },
  {
    id: "2", 
    user_address: "GA8H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
    content: "DeFi yield farming update: Current APY is 12.5%! 🌾 Check out my strategy thread below 👇",
    trade_id: "TRD_003", 
    likes_count: 67,
    comments_count: 12,
    shares_count: 8,
    created_at: "2024-11-10T00:20:00Z"
  },
  {
    id: "3",
    user_address: "GB7H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
    content: "HODL strategy working perfectly! Been holding this BTC position since 2020 🚀",
    likes_count: 45,
    comments_count: 8,
    shares_count: 6,
    created_at: "2024-11-10T00:50:00Z"
  }
]

const MOCK_FOLLOWS: MockFollow[] = [
  {
    id: "1",
    follower_address: "GB6BTGYP3V5E4VS3ENKLQMNZQZM6G7A5QTKZ4DQV7QB2FNBVYMKAS6NO",
    following_address: "GB7H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
    copy_enabled: true,
    allocation_percent: 50,
    created_at: "2024-10-15T00:00:00Z"
  },
  {
    id: "2",
    follower_address: "GB7H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
    following_address: "GA8H3J5D4T2KQ6Z8L4N9M5C7V1B3X8Z5N2M6L9K4Q7R2S6T8W3X5Y7Z9",
    copy_enabled: true,
    allocation_percent: 75,
    created_at: "2024-10-20T00:00:00Z"
  }
]

export class MockDataManager {
  private storageKey = 'sorosocial_demo_data'
  
  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify({
      users: MOCK_USERS,
      trades: MOCK_TRADES,
      posts: MOCK_POSTS,
      follows: MOCK_FOLLOWS
    }))
  }
  
  private loadFromStorage() {
    const data = localStorage.getItem(this.storageKey)
    if (data) {
      return JSON.parse(data)
    }
    this.saveToStorage()
    return {
      users: MOCK_USERS,
      trades: MOCK_TRADES, 
      posts: MOCK_POSTS,
      follows: MOCK_FOLLOWS
    }
  }
  
  seedDemoData() {
    this.saveToStorage()
    return {
      success: true,
      message: "Demo data seeded successfully (using localStorage)",
      data: {
        users_created: MOCK_USERS.length,
        trades_created: MOCK_TRADES.length,
        posts_created: MOCK_POSTS.length,
        follows_created: MOCK_FOLLOWS.length,
        storage: "localStorage",
        message: "You can now explore the social trading platform with demo data!"
      }
    }
  }
  
  clearDemoData() {
    localStorage.removeItem(this.storageKey)
    return {
      success: true,
      message: "Demo data cleared"
    }
  }
  
  getUsers(): MockUser[] {
    return this.loadFromStorage().users
  }
  
  getTrades(): MockTrade[] {
    return this.loadFromStorage().trades
  }
  
  getPosts(): MockPost[] {
    return this.loadFromStorage().posts
  }
  
  getFollows(): MockFollow[] {
    return this.loadFromStorage().follows
  }
  
  hasData(): boolean {
    return localStorage.getItem(this.storageKey) !== null
  }
}

export const mockDataManager = new MockDataManager()