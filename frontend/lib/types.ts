// TypeScript types for the entire application
// These types match the Soroban smart contract structures

export interface UserProfile {
  address: string
  username: string
  bio: string
  reputationScore: number
  followerCount: number
  followingCount: number
  createdAt: number
}

export interface TraderProfile extends UserProfile {
  verified: boolean
  avatar?: string
  badges?: string[]
  stats: TraderStats
}

export interface TraderStats {
  totalReturn: number
  winRate: number
  totalTrades: number
  profitableTrades: number
  totalVolume: number
  maxDrawdown: number
  avgTradeSize: number
  copiers: number
  riskLevel: "Low" | "Medium" | "High"
}

export interface Trade {
  id: string
  traderId: string
  traderName: string
  traderUsername: string
  traderAvatar?: string
  traderVerified: boolean
  tokenIn: string
  tokenOut: string
  amountIn: number
  amountOut: number
  minAmountOut: number
  profit: number
  profitPercent: number
  timestamp: number
  status: "pending" | "executed" | "failed"
  likes: number
  comments: number
  copies: number
}

export interface CopyTradeConfig {
  traderId: string
  investmentAmount: number
  copyRatio: number
  stopLoss?: number
  takeProfit?: number
  maxTradeAmount?: number
  copyMode: "instant" | "delayed" | "manual"
}

export interface ActiveCopyTrade {
  id: string
  trader: TraderProfile
  invested: number
  currentValue: number
  profit: number
  profitPercent: number
  copyRatio: number
  status: "active" | "paused" | "stopped"
  startedAt: number
}

export interface PortfolioSummary {
  totalValue: number
  totalInvested: number
  totalProfit: number
  todayPnL: number
  todayPnLPercent: number
  availableBalance: number
}

export interface Holding {
  token: string
  amount: number
  value: number
  cost: number
  profit: number
  profitPercent: number
  source: "copy" | "manual"
  traderId?: string
}

export interface Portfolio {
  totalValue: number
  totalReturn: number
  investedAmount: number
  availableBalance: number
  todayPnL: number
  todayPnLPercent: number
  totalPnL: number
  totalPnLPercent: number
  activeCopies: number
  holdings?: Holding[]
}

export interface ActiveCopy {
  id: string
  trader: Trader
  amount: number
  allocation: number
  pnl: number
  pnlPercent: number
  startDate: string
  status: "ACTIVE" | "PAUSED" | "STOPPED"
}

export interface CopyTrade {
  id: string
  trader: Trader
  amount: number
  allocation: number
  pnl: number
  pnlPercent: number
  startDate: string
  status: "ACTIVE" | "PAUSED" | "STOPPED"
}

export interface Trader {
  id: string
  address: string
  username: string
  displayName: string
  avatar: string
  verified: boolean
  bio: string
  followers: number
  following: number
  copiers: number
  totalReturn: number
  winRate: number
  avgReturn: number
  riskScore: number
  totalTrades: number
  successfulTrades: number
  portfolioValue: number
  joinedDate: string
  tags: string[]
  stats: {
    totalVolume: number
    avgTradeSize: number
    maxDrawdown: number
    sharpeRatio: number
    profitFactor: number
  }
}

export interface FeedPost {
  id: string
  traderId: string
  trader: Trader
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  trade?: {
    asset: string
    action: "BUY" | "SELL" | "HOLD"
    amount: number
    price: number
    profit: number
    timestamp: string
  }
}

export interface Comment {
  id: string
  postId: string
  user: {
    username: string
    avatar: string
  }
  text: string
  timestamp: string
  likes: number
}

export interface CopyConfig {
  trader: Trader
  amount: number // XLM amount
  copyRatio: number // Percentage (0-100)
  stopLoss: number // Percentage
  takeProfit: number // Percentage
  maxPerTrade: number // Max XLM per trade
  active: boolean
  paused: boolean
  totalProfit: number // XLM profit
  startDate: string
}

export interface WalletState {
  connected: boolean
  address: string | null
  balance: number // XLM balance
}

export interface User extends Trader {
  role: "user" | "admin" | "superadmin"
  permissions: Permission[]
  verifiedAt?: string
  verifiedBy?: string
}

export type Permission =
  | "verify_users"
  | "ban_users"
  | "delete_posts"
  | "review_reports"
  | "manage_traders"
  | "access_admin_panel"
  | "manage_admins"

export interface Report {
  id: string
  reportedBy: string
  reportedByUsername?: string
  contentType: "post" | "user" | "comment" | "trade"
  contentId: string
  reason: "spam" | "harassment" | "inappropriate" | "scam" | "fraud" | "other"
  description?: string
  status: "pending" | "under_review" | "resolved" | "dismissed"
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  resolution?: string
}
