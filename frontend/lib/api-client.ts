// SoroSocial API Client
// Handles all interactions with Soroban smart contracts and Supabase database

import { createClient } from '@supabase/supabase-js'
import { stellarConfig, callSorobanReadMethod, callSorobanWriteMethod } from './stellar'
import { UserProfile, Trader, Trade, CopyTrade, PerformanceMetrics } from './types'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseKey)

// API Response types
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

interface ContractCallResponse {
  success: boolean
  result?: any
  txHash?: string
  error?: string
}

// ===== SMART CONTRACT INTERACTIONS =====

// User Management
export async function createUserProfile(username: string, bio: string = ''): Promise<ApiResponse<{ address: string, profile: UserProfile }>> {
  try {
    const contractId = stellarConfig.contractIds.userRegistry
    if (!contractId) {
      throw new Error('User registry contract not configured')
    }

    // Get current user's address from wallet
    const userAddress = await getCurrentUserAddress()
    if (!userAddress) {
      throw new Error('No wallet connected')
    }

    // Call create_profile on smart contract
    const result = await callSorobanWriteMethod(
      contractId,
      'create_profile',
      [userAddress, username, bio],
      userAddress
    )

    if (result.success) {
      // Cache in Supabase for performance
      const profile: UserProfile = {
        address: userAddress,
        username,
        bio,
        reputationScore: 0,
        followerCount: 0,
        followingCount: 0,
        createdAt: Date.now(),
        verified: false
      }

      await supabase
        .from('users')
        .upsert([{
          address: userAddress,
          username,
          bio,
          reputation_score: 0,
          follower_count: 0,
          following_count: 0,
          verified: false
        }])

      return { success: true, data: { address: userAddress, profile } }
    } else {
      return { success: false, error: 'Failed to create profile on blockchain' }
    }

  } catch (error) {
    console.error('Create profile error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getUserProfile(address: string): Promise<ApiResponse<UserProfile>> {
  try {
    // Try to get from Supabase cache first
    const { data: cachedProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('address', address)
      .single()

    if (cachedProfile && !error) {
      return {
        success: true,
        data: {
          address: cachedProfile.address,
          username: cachedProfile.username,
          bio: cachedProfile.bio,
          reputationScore: cachedProfile.reputation_score,
          followerCount: cachedProfile.follower_count,
          followingCount: cachedProfile.following_count,
          createdAt: new Date(cachedProfile.created_at).getTime(),
          verified: cachedProfile.verified
        }
      }
    }

    // Fallback to smart contract
    const contractId = stellarConfig.contractIds.userRegistry
    if (!contractId) {
      throw new Error('User registry contract not configured')
    }

    const result = await callSorobanReadMethod(contractId, 'get_profile', [address])
    
    return {
      success: true,
      data: {
        address: result.address,
        username: result.username,
        bio: result.bio,
        reputationScore: result.reputation_score,
        followerCount: result.follower_count,
        followingCount: result.following_count,
        createdAt: result.created_at,
        verified: result.verified
      }
    }

  } catch (error) {
    console.error('Get profile error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Profile not found' }
  }
}

export async function updateUserProfile(bio: string): Promise<ApiResponse<boolean>> {
  try {
    const contractId = stellarConfig.contractIds.userRegistry
    if (!contractId) {
      throw new Error('User registry contract not configured')
    }

    const userAddress = await getCurrentUserAddress()
    if (!userAddress) {
      throw new Error('No wallet connected')
    }

    const result = await callSorobanWriteMethod(
      contractId,
      'update_profile',
      [userAddress, bio],
      userAddress
    )

    if (result.success) {
      // Update cache
      await supabase
        .from('users')
        .update({ bio })
        .eq('address', userAddress)

      return { success: true, data: true }
    } else {
      return { success: false, error: 'Failed to update profile' }
    }

  } catch (error) {
    console.error('Update profile error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Social Features
export async function followTrader(
  targetAddress: string,
  enableCopy: boolean = false,
  allocationPercent: number = 100
): Promise<ApiResponse<boolean>> {
  try {
    const contractId = stellarConfig.contractIds.userRegistry
    if (!contractId) {
      throw new Error('User registry contract not configured')
    }

    const userAddress = await getCurrentUserAddress()
    if (!userAddress) {
      throw new Error('No wallet connected')
    }

    const result = await callSorobanWriteMethod(
      contractId,
      'follow_user',
      [userAddress, targetAddress, enableCopy, allocationPercent],
      userAddress
    )

    if (result.success) {
      // Update cache
      await supabase
        .from('follows')
        .upsert([{
          follower_address: userAddress,
          following_address: targetAddress,
          copy_enabled: enableCopy,
          allocation_percent: allocationPercent
        }])

      return { success: true, data: true }
    } else {
      return { success: false, error: 'Failed to follow trader' }
    }

  } catch (error) {
    console.error('Follow trader error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function unfollowTrader(targetAddress: string): Promise<ApiResponse<boolean>> {
  try {
    const contractId = stellarConfig.contractIds.userRegistry
    if (!contractId) {
      throw new Error('User registry contract not configured')
    }

    const userAddress = await getCurrentUserAddress()
    if (!userAddress) {
      throw new Error('No wallet connected')
    }

    const result = await callSorobanWriteMethod(
      contractId,
      'unfollow_user',
      [userAddress, targetAddress],
      userAddress
    )

    if (result.success) {
      // Update cache
      await supabase
        .from('follows')
        .delete()
        .eq('follower_address', userAddress)
        .eq('following_address', targetAddress)

      return { success: true, data: true }
    } else {
      return { success: false, error: 'Failed to unfollow trader' }
    }

  } catch (error) {
    console.error('Unfollow trader error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getFollowers(address: string, limit: number = 20, offset: number = 0): Promise<ApiResponse<string[]>> {
  try {
    const contractId = stellarConfig.contractIds.userRegistry
    if (!contractId) {
      throw new Error('User registry contract not configured')
    }

    const result = await callSorobanReadMethod(contractId, 'get_followers', [address, limit, offset])
    
    return { success: true, data: result }

  } catch (error) {
    console.error('Get followers error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get followers' }
  }
}

export async function getFollowing(address: string, limit: number = 20, offset: number = 0): Promise<ApiResponse<string[]>> {
  try {
    const contractId = stellarConfig.contractIds.userRegistry
    if (!contractId) {
      throw new Error('User registry contract not configured')
    }

    const result = await callSorobanReadMethod(contractId, 'get_following', [address, limit, offset])
    
    return { success: true, data: result }

  } catch (error) {
    console.error('Get following error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get following' }
  }
}

// Trading Operations
export async function executeTradeAPI(
  tokenIn: string,
  tokenOut: string,
  amountIn: number,
  minAmountOut: number
): Promise<ApiResponse<{ tradeId: string, txHash: string }>> {
  try {
    const contractId = stellarConfig.contractIds.trading
    if (!contractId) {
      throw new Error('Trading contract not configured')
    }

    const userAddress = await getCurrentUserAddress()
    if (!userAddress) {
      throw new Error('No wallet connected')
    }

    const result = await callSorobanWriteMethod(
      contractId,
      'execute_trade',
      [userAddress, tokenIn, tokenOut, amountIn, minAmountOut],
      userAddress
    )

    if (result.success) {
      // Cache trade in Supabase
      const tradeData = {
        trade_id: `trade_${Date.now()}`,
        trader_address: userAddress,
        token_in: tokenIn,
        token_out: tokenOut,
        amount_in: amountIn,
        amount_out: minAmountOut * 1.05, // Simulated
        min_amount_out: minAmountOut,
        pnl: 0,
        status: 'executed'
      }

      await supabase.from('trades').insert([tradeData])

      return { 
        success: true, 
        data: { 
          tradeId: tradeData.trade_id, 
          txHash: result.txHash 
        } 
      }
    } else {
      return { success: false, error: 'Failed to execute trade' }
    }

  } catch (error) {
    console.error('Execute trade error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getTradeHistory(traderAddress: string, limit: number = 20, offset: number = 0): Promise<ApiResponse<Trade[]>> {
  try {
    const contractId = stellarConfig.contractIds.trading
    if (!contractId) {
      throw new Error('Trading contract not configured')
    }

    const result = await callSorobanReadMethod(contractId, 'get_trade_history', [traderAddress, limit, offset])
    
    return { success: true, data: result }

  } catch (error) {
    console.error('Get trade history error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get trade history' }
  }
}

// Performance and Reputation
export async function getTraderPerformance(traderAddress: string): Promise<ApiResponse<PerformanceMetrics>> {
  try {
    const contractId = stellarConfig.contractIds.reputation
    if (!contractId) {
      throw new Error('Reputation contract not configured')
    }

    const result = await callSorobanReadMethod(contractId, 'get_metrics', [traderAddress])
    
    return { success: true, data: result }

  } catch (error) {
    console.error('Get performance error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get performance' }
  }
}

export async function getReputationScore(traderAddress: string): Promise<ApiResponse<number>> {
  try {
    const contractId = stellarConfig.contractIds.reputation
    if (!contractId) {
      throw new Error('Reputation contract not configured')
    }

    const result = await callSorobanReadMethod(contractId, 'calculate_reputation_score', [traderAddress])
    
    return { success: true, data: result }

  } catch (error) {
    console.error('Get reputation score error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get reputation score' }
  }
}

export async function getLeaderboard(metricType: string = 'reputation', limit: number = 20): Promise<ApiResponse<Array<{ address: string, score: number }>>> {
  try {
    const contractId = stellarConfig.contractIds.reputation
    if (!contractId) {
      throw new Error('Reputation contract not configured')
    }

    const result = await callSorobanReadMethod(contractId, 'get_leaderboard', [metricType, limit])
    
    return { success: true, data: result }

  } catch (error) {
    console.error('Get leaderboard error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get leaderboard' }
  }
}

// ===== DATABASE OPERATIONS =====

// Social Feed
export async function getSocialFeed(limit: number = 20, offset: number = 0): Promise<ApiResponse<any[]>> {
  try {
    const { data, error } = await supabase
      .from('activity_feed')
      .select(`
        *,
        user:users!activity_feed_user_address_fkey (
          address,
          username,
          bio,
          reputation_score,
          verified
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return { success: true, data }

  } catch (error) {
    console.error('Get social feed error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get social feed' }
  }
}

// Posts and Comments
export async function createPost(content: string, tradeId?: string): Promise<ApiResponse<any>> {
  try {
    const userAddress = await getCurrentUserAddress()
    if (!userAddress) {
      throw new Error('No wallet connected')
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        user_address: userAddress,
        content,
        trade_id: tradeId || null
      }])
      .select()
      .single()

    if (error) throw error

    // Add to activity feed
    await supabase
      .from('activity_feed')
      .insert([{
        user_address: userAddress,
        type: 'post',
        content: { post_id: data.id, content }
      }])

    return { success: true, data }

  } catch (error) {
    console.error('Create post error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create post' }
  }
}

export async function getNotifications(userAddress: string, limit: number = 20): Promise<ApiResponse<any[]>> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_address', userAddress)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { success: true, data }

  } catch (error) {
    console.error('Get notifications error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get notifications' }
  }
}

// Search and Discovery
export async function searchTraders(query: string, limit: number = 10): Promise<ApiResponse<Trader[]>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.ilike.%${query}%,bio.ilike.%${query}%`)
      .eq('verified', true)
      .limit(limit)

    if (error) throw error

    const traders: Trader[] = data.map(user => ({
      id: user.id,
      address: user.address,
      username: user.username,
      displayName: user.username,
      avatar: user.avatar_url || '/placeholder-user.jpg',
      verified: user.verified,
      bio: user.bio,
      followers: user.follower_count,
      following: user.following_count,
      copiers: 0, // TODO: Calculate from follows table
      totalReturn: 0, // TODO: Calculate from performance metrics
      winRate: 0, // TODO: Get from performance metrics
      avgReturn: 0,
      riskScore: 0,
      totalTrades: 0,
      successfulTrades: 0,
      portfolioValue: 0,
      joinedDate: user.created_at,
      tags: [],
      stats: {
        totalVolume: 0,
        avgTradeSize: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        profitFactor: 0
      }
    }))

    return { success: true, data: traders }

  } catch (error) {
    console.error('Search traders error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to search traders' }
  }
}

// ===== HELPER FUNCTIONS =====

async function getCurrentUserAddress(): Promise<string | null> {
  // This would get the connected wallet address
  // For now, return a mock address
  if (typeof window !== 'undefined') {
    return localStorage.getItem('stellar_wallet_address')
  }
  return null
}

export async function checkContractStatus(): Promise<ApiResponse<{ users: boolean, trading: boolean, reputation: boolean }>> {
  const status = {
    users: !!stellarConfig.contractIds.userRegistry,
    trading: !!stellarConfig.contractIds.trading,
    reputation: !!stellarConfig.contractIds.reputation
  }

  return { success: true, data: status }
}

// Real-time subscriptions
export function subscribeToTable(table: string, callback: (payload: any) => void) {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: table
    }, callback)
    .subscribe()
}

export function subscribeToNotifications(userAddress: string, callback: (payload: any) => void) {
  return supabase
    .channel(`notifications:${userAddress}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_address=eq.${userAddress}`
    }, callback)
    .subscribe()
}