// Local storage based database for persistence without backend
// Simulates database operations using localStorage

export interface StoredUser {
  address: string
  username: string
  displayName: string
  bio: string
  avatar: string
  verified: boolean
  createdAt: string
}

export interface StoredCopyTrade {
  id: string
  traderId: string
  amount: number
  copyRatio: number
  stopLoss: number
  takeProfit: number
  maxPerTrade: number
  paused: boolean
  totalProfit: number
  startDate: string
  trades: Array<{
    id: string
    timestamp: string
    profit: number
  }>
}

export interface StoredFollower {
  userId: string
  traderId: string
  followedAt: string
}

class LocalDatabase {
  private prefix = "tradesocial_"

  // Generic get/set methods
  private get<T>(key: string): T | null {
    if (typeof window === "undefined") return null
    const item = localStorage.getItem(this.prefix + key)
    if (!item) return null
    try {
      return JSON.parse(item) as T
    } catch {
      return null
    }
  }

  private set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.prefix + key, JSON.stringify(value))
  }

  private delete(key: string): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.prefix + key)
  }

  // User operations
  getUser(address: string): StoredUser | null {
    return this.get<StoredUser>(`user_${address}`)
  }

  saveUser(user: StoredUser): void {
    this.set(`user_${user.address}`, user)
  }

  // Copy trade operations
  getCopyTrades(userAddress: string): StoredCopyTrade[] {
    return this.get<StoredCopyTrade[]>(`copytrades_${userAddress}`) || []
  }

  saveCopyTrade(userAddress: string, copyTrade: StoredCopyTrade): void {
    const trades = this.getCopyTrades(userAddress)
    const existing = trades.findIndex((t) => t.id === copyTrade.id)
    if (existing >= 0) {
      trades[existing] = copyTrade
    } else {
      trades.push(copyTrade)
    }
    this.set(`copytrades_${userAddress}`, trades)
  }

  deleteCopyTrade(userAddress: string, traderId: string): void {
    const trades = this.getCopyTrades(userAddress).filter((t) => t.traderId !== traderId)
    this.set(`copytrades_${userAddress}`, trades)
  }

  // Follower operations
  getFollowers(userAddress: string): StoredFollower[] {
    return this.get<StoredFollower[]>(`followers_${userAddress}`) || []
  }

  addFollower(userAddress: string, traderId: string): void {
    const followers = this.getFollowers(userAddress)
    if (!followers.find((f) => f.traderId === traderId)) {
      followers.push({
        userId: userAddress,
        traderId,
        followedAt: new Date().toISOString(),
      })
      this.set(`followers_${userAddress}`, followers)
    }
  }

  removeFollower(userAddress: string, traderId: string): void {
    const followers = this.getFollowers(userAddress).filter((f) => f.traderId !== traderId)
    this.set(`followers_${userAddress}`, followers)
  }

  isFollowing(userAddress: string, traderId: string): boolean {
    const followers = this.getFollowers(userAddress)
    return followers.some((f) => f.traderId === traderId)
  }

  // Clear all data for a user (on disconnect)
  clearUserData(userAddress: string): void {
    this.delete(`user_${userAddress}`)
    this.delete(`copytrades_${userAddress}`)
    this.delete(`followers_${userAddress}`)
  }

  // Export/Import for backup
  exportUserData(userAddress: string): object {
    return {
      user: this.getUser(userAddress),
      copyTrades: this.getCopyTrades(userAddress),
      followers: this.getFollowers(userAddress),
    }
  }

  importUserData(userAddress: string, data: any): void {
    if (data.user) this.saveUser(data.user)
    if (data.copyTrades) this.set(`copytrades_${userAddress}`, data.copyTrades)
    if (data.followers) this.set(`followers_${userAddress}`, data.followers)
  }
}

export const localDB = new LocalDatabase()
