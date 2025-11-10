import { create } from "zustand"
import { persist } from "zustand/middleware"
import { SEED_TRADERS, SEED_POSTS, SEED_STORIES, SEED_TRADES } from "./seed-data"
import type { Trader, FeedPost, Comment, CopyConfig, WalletState, Trade, User, Report } from "./types"
import { localDB, type StoredUser, type StoredCopyTrade } from "./local-db"
import { getAdminRole, ADMIN_PERMISSIONS } from "./admin"

interface AppState {
  // Wallet
  wallet: WalletState
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  deposit: (amountXLM: number) => void
  withdraw: (amountXLM: number) => void

  // User
  user: User | null
  isAuthenticated: boolean
  needsProfileSetup: boolean
  initializeUser: (address: string, username?: string, bio?: string) => void
  updateUserProfile: (username: string, bio: string, avatar?: string) => void
  loadUserFromStorage: (address: string) => void

  // Traders
  traders: Trader[]
  followedTraders: string[]
  followTrader: (traderId: string) => void
  unfollowTrader: (traderId: string) => void
  isFollowing: (traderId: string) => boolean

  // Feed (posts)
  feed: FeedPost[]
  likePost: (postId: string) => void
  unlikePost: (postId: string) => void
  createPost: (content: string, trade?: any) => void
  deletePost: (postId: string) => void

  // Stories (separate from posts)
  stories: any[]
  createStory: (type: "image" | "text", content: string, text?: string) => void

  // Comments
  comments: Record<string, Comment[]>
  addComment: (postId: string, text: string) => void

  // Trades
  trades: Trade[]

  // Copy Trading
  activeCopies: CopyConfig[]
  startCopyTrading: (config: CopyConfig) => void
  pauseCopyTrading: (traderId: string) => void
  resumeCopyTrading: (traderId: string) => void
  stopCopyTrading: (traderId: string) => void

  reports: Report[]
  createReport: (report: Omit<Report, "id" | "createdAt" | "status">) => void
  resolveReport: (reportId: string, resolution: string) => void
  dismissReport: (reportId: string) => void
  verifyUser: (userId: string) => void
  banUser: (userId: string) => void

  // Admin Functions
  verifyTraderAdmin: (traderId: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      wallet: {
        connected: false,
        address: null,
        balance: 0,
      },
      user: null,
      isAuthenticated: false,
      needsProfileSetup: false,
      traders: SEED_TRADERS,
      followedTraders: [],
      feed: SEED_POSTS,
      stories: SEED_STORIES,
      trades: SEED_TRADES,
      activeCopies: [],
      comments: {},
      reports: [],

      connectWallet: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockAddress = "G" + Math.random().toString(36).substring(2, 15).toUpperCase().padEnd(55, "X")

        const storedUser = localDB.getUser(mockAddress)

        if (storedUser) {
          const role = getAdminRole(mockAddress)
          const permissions = ADMIN_PERMISSIONS[role] || []

          const user: User = {
            id: storedUser.address,
            address: storedUser.address,
            username: storedUser.username,
            displayName: storedUser.displayName,
            avatar: storedUser.avatar,
            verified: storedUser.verified,
            bio: storedUser.bio,
            followers: 0,
            following: 0,
            copiers: 0,
            totalReturn: 0,
            winRate: 0,
            avgReturn: 0,
            riskScore: 5,
            totalTrades: 0,
            successfulTrades: 0,
            portfolioValue: 0,
            joinedDate: storedUser.createdAt,
            tags: [],
            stats: {
              totalVolume: 0,
              avgTradeSize: 0,
              maxDrawdown: 0,
              sharpeRatio: 0,
              profitFactor: 0,
            },
            role,
            permissions,
          }

          const savedCopyTrades = localDB.getCopyTrades(mockAddress)
          const activeCopies: CopyConfig[] = savedCopyTrades.map((saved) => {
            const trader = SEED_TRADERS.find((t) => t.id === saved.traderId)
            return {
              trader: trader || SEED_TRADERS[0],
              amount: saved.amount,
              copyRatio: saved.copyRatio,
              stopLoss: saved.stopLoss,
              takeProfit: saved.takeProfit,
              maxPerTrade: saved.maxPerTrade,
              active: !saved.paused,
              paused: saved.paused,
              totalProfit: saved.totalProfit,
              startDate: saved.startDate,
            }
          })

          const followers = localDB.getFollowers(mockAddress)
          const followedTraders = followers.map((f) => f.traderId)

          set({
            wallet: {
              connected: true,
              address: mockAddress,
              balance: 10000,
            },
            user,
            isAuthenticated: true,
            needsProfileSetup: false,
            activeCopies,
            followedTraders,
          })
        } else {
          set({
            wallet: {
              connected: true,
              address: mockAddress,
              balance: 10000,
            },
            user: null,
            isAuthenticated: false,
            needsProfileSetup: true,
          })
        }
      },

      disconnectWallet: () => {
        const { wallet } = get()
        if (wallet.address) {
          localDB.clearUserData(wallet.address)
        }
        set({
          wallet: { connected: false, address: null, balance: 0 },
          user: null,
          isAuthenticated: false,
          needsProfileSetup: false,
          activeCopies: [],
          followedTraders: [],
        })
      },

      deposit: (amountXLM: number) => {
        set((state) => ({
          wallet: { ...state.wallet, balance: state.wallet.balance + amountXLM },
        }))
      },

      withdraw: (amountXLM: number) => {
        const { wallet } = get()
        if (wallet.balance >= amountXLM) {
          set((state) => ({
            wallet: { ...state.wallet, balance: state.wallet.balance - amountXLM },
          }))
        }
      },

      initializeUser: (address: string, username?: string, bio?: string) => {
        const displayName = username?.replace("@", "") || `User ${address.substring(0, 6)}`
        const role = getAdminRole(address)
        const permissions = ADMIN_PERMISSIONS[role] || []

        const newUser: User = {
          id: address,
          address,
          username: username || `@user${address.substring(0, 6)}`,
          displayName,
          avatar: `/placeholder.svg?height=100&width=100&text=${displayName.substring(0, 2)}`,
          verified: false,
          bio: bio || "New trader on TradeSocial",
          followers: 0,
          following: 0,
          copiers: 0,
          totalReturn: 0,
          winRate: 0,
          avgReturn: 0,
          riskScore: 5,
          totalTrades: 0,
          successfulTrades: 0,
          portfolioValue: 0,
          joinedDate: new Date().toISOString(),
          tags: [],
          stats: {
            totalVolume: 0,
            avgTradeSize: 0,
            maxDrawdown: 0,
            sharpeRatio: 0,
            profitFactor: 0,
          },
          role,
          permissions,
        }

        const storedUser: StoredUser = {
          address,
          username: newUser.username,
          displayName: newUser.displayName,
          bio: newUser.bio,
          avatar: newUser.avatar,
          verified: false,
          createdAt: newUser.joinedDate,
        }
        localDB.saveUser(storedUser)

        set({ user: newUser, isAuthenticated: true, needsProfileSetup: false })
      },

      updateUserProfile: (username: string, bio: string, avatar?: string) => {
        const { user } = get()
        if (!user) return

        const displayName = username.replace("@", "")
        const updatedUser = {
          ...user,
          username,
          bio,
          displayName,
          avatar: avatar || user.avatar,
        }

        const storedUser: StoredUser = {
          address: user.address,
          username,
          displayName,
          bio,
          avatar: avatar || user.avatar,
          verified: user.verified,
          createdAt: user.joinedDate,
        }
        localDB.saveUser(storedUser)

        set({ user: updatedUser })
      },

      loadUserFromStorage: (address: string) => {
        const storedUser = localDB.getUser(address)
        if (storedUser) {
          const role = getAdminRole(address)
          const permissions = ADMIN_PERMISSIONS[role] || []

          const user: User = {
            id: storedUser.address,
            address: storedUser.address,
            username: storedUser.username,
            displayName: storedUser.displayName,
            avatar: storedUser.avatar,
            verified: storedUser.verified,
            bio: storedUser.bio,
            followers: 0,
            following: 0,
            copiers: 0,
            totalReturn: 0,
            winRate: 0,
            avgReturn: 0,
            riskScore: 5,
            totalTrades: 0,
            successfulTrades: 0,
            portfolioValue: 0,
            joinedDate: storedUser.createdAt,
            tags: [],
            stats: {
              totalVolume: 0,
              avgTradeSize: 0,
              maxDrawdown: 0,
              sharpeRatio: 0,
              profitFactor: 0,
            },
            role,
            permissions,
          }
          set({ user, isAuthenticated: true })
        }
      },

      followTrader: (traderId: string) => {
        const { wallet } = get()
        if (wallet.address) {
          localDB.addFollower(wallet.address, traderId)
        }
        set((state) => ({
          followedTraders: [...state.followedTraders, traderId],
          traders: state.traders.map((t) => (t.id === traderId ? { ...t, followers: t.followers + 1 } : t)),
        }))
      },

      unfollowTrader: (traderId: string) => {
        const { wallet } = get()
        if (wallet.address) {
          localDB.removeFollower(wallet.address, traderId)
        }
        set((state) => ({
          followedTraders: state.followedTraders.filter((id) => id !== traderId),
          traders: state.traders.map((t) =>
            t.id === traderId ? { ...t, followers: Math.max(0, t.followers - 1) } : t,
          ),
        }))
      },

      isFollowing: (traderId: string) => {
        return get().followedTraders.includes(traderId)
      },

      likePost: (postId: string) => {
        set((state) => ({
          feed: state.feed.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)),
        }))
      },

      unlikePost: (postId: string) => {
        set((state) => ({
          feed: state.feed.map((post) => (post.id === postId ? { ...post, likes: Math.max(0, post.likes - 1) } : post)),
        }))
      },

      createPost: (content: string, trade?: any) => {
        const { user } = get()
        if (!user) return

        const newPost: FeedPost = {
          id: `post-${Date.now()}`,
          traderId: user.id,
          trader: user,
          content,
          timestamp: new Date().toISOString(),
          likes: 0,
          comments: 0,
          shares: 0,
          trade,
        }

        set((state) => ({
          feed: [newPost, ...state.feed],
        }))
      },

      deletePost: (postId: string) => {
        set((state) => ({
          feed: state.feed.filter((post) => post.id !== postId),
        }))
      },

      createStory: (type: "image" | "text", content: string, text?: string) => {
        const { user } = get()
        if (!user) return

        const newStory = {
          id: `story-${Date.now()}`,
          traderId: user.id,
          trader: user,
          type,
          content,
          text,
          timestamp: new Date().toISOString(),
          views: 0,
        }

        set((state) => ({
          stories: [newStory, ...state.stories],
        }))
      },

      addComment: (postId: string, text: string) => {
        const { user } = get()
        if (!user) return

        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          postId,
          user: {
            username: user.username,
            avatar: user.avatar,
          },
          text,
          timestamp: new Date().toISOString(),
          likes: 0,
        }

        set((state) => ({
          comments: {
            ...state.comments,
            [postId]: [...(state.comments[postId] || []), newComment],
          },
          feed: state.feed.map((post) => (post.id === postId ? { ...post, comments: post.comments + 1 } : post)),
        }))
      },

      startCopyTrading: (config: CopyConfig) => {
        const { wallet } = get()
        if (wallet.balance < config.amount) {
          return
        }

        if (wallet.address) {
          const storedCopyTrade: StoredCopyTrade = {
            id: `copy-${Date.now()}`,
            traderId: config.trader.id,
            amount: config.amount,
            copyRatio: config.copyRatio,
            stopLoss: config.stopLoss,
            takeProfit: config.takeProfit,
            maxPerTrade: config.maxPerTrade,
            paused: false,
            totalProfit: 0,
            startDate: config.startDate,
            trades: [],
          }
          localDB.saveCopyTrade(wallet.address, storedCopyTrade)
        }

        set((state) => ({
          activeCopies: [...state.activeCopies, config],
          wallet: { ...state.wallet, balance: state.wallet.balance - config.amount },
        }))
      },

      pauseCopyTrading: (traderId: string) => {
        const { wallet, activeCopies } = get()
        if (wallet.address) {
          const copy = activeCopies.find((c) => c.trader.id === traderId)
          if (copy) {
            const savedCopyTrades = localDB.getCopyTrades(wallet.address)
            const savedCopy = savedCopyTrades.find((c) => c.traderId === traderId)
            if (savedCopy) {
              savedCopy.paused = true
              localDB.saveCopyTrade(wallet.address, savedCopy)
            }
          }
        }
        set((state) => ({
          activeCopies: state.activeCopies.map((copy) =>
            copy.trader.id === traderId ? { ...copy, paused: true } : copy,
          ),
        }))
      },

      resumeCopyTrading: (traderId: string) => {
        const { wallet, activeCopies } = get()
        if (wallet.address) {
          const copy = activeCopies.find((c) => c.trader.id === traderId)
          if (copy) {
            const savedCopyTrades = localDB.getCopyTrades(wallet.address)
            const savedCopy = savedCopyTrades.find((c) => c.traderId === traderId)
            if (savedCopy) {
              savedCopy.paused = false
              localDB.saveCopyTrade(wallet.address, savedCopy)
            }
          }
        }
        set((state) => ({
          activeCopies: state.activeCopies.map((copy) =>
            copy.trader.id === traderId ? { ...copy, paused: false } : copy,
          ),
        }))
      },

      stopCopyTrading: (traderId: string) => {
        const { wallet } = get()
        const copy = get().activeCopies.find((c) => c.trader.id === traderId)
        if (copy) {
          const returnAmount = copy.amount + copy.totalProfit

          if (wallet.address) {
            localDB.deleteCopyTrade(wallet.address, traderId)
          }

          set((state) => ({
            activeCopies: state.activeCopies.filter((c) => c.trader.id !== traderId),
            wallet: { ...state.wallet, balance: state.wallet.balance + returnAmount },
          }))
        }
      },

      createReport: (report: Omit<Report, "id" | "createdAt" | "status">) => {
        const newReport: Report = {
          ...report,
          id: `report-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: "pending",
        }

        set((state) => ({
          reports: [...state.reports, newReport],
        }))
      },

      resolveReport: (reportId: string, resolution: string) => {
        const { user } = get()
        if (!user) return

        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === reportId
              ? {
                  ...report,
                  status: "resolved" as const,
                  resolution,
                  reviewedBy: user.address,
                  reviewedAt: new Date().toISOString(),
                }
              : report,
          ),
        }))
      },

      dismissReport: (reportId: string) => {
        const { user } = get()
        if (!user) return

        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === reportId
              ? {
                  ...report,
                  status: "dismissed" as const,
                  reviewedBy: user.address,
                  reviewedAt: new Date().toISOString(),
                }
              : report,
          ),
        }))
      },

      verifyUser: (userId: string) => {
        set((state) => ({
          traders: state.traders.map((trader) =>
            trader.id === userId ? { ...trader, verified: true, verifiedAt: new Date().toISOString() } : trader,
          ),
        }))
      },

      banUser: (userId: string) => {
        set((state) => ({
          traders: state.traders.filter((trader) => trader.id !== userId),
        }))
      },

      verifyTraderAdmin: (traderId: string) => {
        const { user } = get()
        if (!user) return

        set((state) => ({
          traders: state.traders.map((trader) =>
            trader.id === traderId
              ? { ...trader, verified: true, verifiedAt: new Date().toISOString(), verifiedBy: user.address }
              : trader,
          ),
        }))
      },
    }),
    {
      name: "tradesocial-xlm-storage",
      partialize: (state) => ({
        wallet: state.wallet,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        needsProfileSetup: state.needsProfileSetup,
        activeCopies: state.activeCopies,
        followedTraders: state.followedTraders,
        trades: state.trades,
        reports: state.reports,
      }),
    },
  ),
)
