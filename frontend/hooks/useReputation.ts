"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "./useWallet"
import { 
  getTraderPerformance,
  getReputationScore,
  getLeaderboard,
  subscribeToTable,
  type ApiResponse
} from "@/lib/api-client"
import { PerformanceMetrics, Trader } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface ReputationHookState {
  performanceMetrics: PerformanceMetrics | null
  reputationScore: number | null
  leaderboard: Array<{ address: string, score: number }>
  isLoading: boolean
  error: string | null
}

export function useReputation() {
  const { wallet, isConnecting } = useWallet()
  const [state, setState] = useState<ReputationHookState>({
    performanceMetrics: null,
    reputationScore: null,
    leaderboard: [],
    isLoading: false,
    error: null
  })

  const [subscriptions, setSubscriptions] = useState<any[]>([])

  // Get trader performance metrics
  const loadPerformanceMetrics = useCallback(async (traderAddress: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const result = await getTraderPerformance(traderAddress)
      
      if (result.success && result.data) {
        setState(prev => ({ 
          ...prev, 
          performanceMetrics: result.data!, 
          isLoading: false 
        }))
        
        return { success: true, data: result.data }
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: result.error || "Failed to load performance metrics" 
        }))
        
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }))
      
      return { success: false, error: errorMessage }
    }
  }, [])

  // Get reputation score
  const loadReputationScore = useCallback(async (traderAddress: string) => {
    try {
      const result = await getReputationScore(traderAddress)
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          reputationScore: result.data || 0 
        }))
        
        return { success: true, data: result.data }
      } else {
        console.error('Failed to load reputation score:', result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Load reputation score error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }, [])

  // Load leaderboard
  const loadLeaderboard = useCallback(async (metricType: string = 'reputation', limit: number = 20) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const result = await getLeaderboard(metricType, limit)
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          leaderboard: result.data || [], 
          isLoading: false 
        }))
        
        return { success: true, data: result.data }
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: result.error || "Failed to load leaderboard" 
        }))
        
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }))
      
      return { success: false, error: errorMessage }
    }
  }, [])

  // Load trader reputation data (performance + score)
  const loadTraderReputation = useCallback(async (traderAddress: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // Load performance metrics and reputation score in parallel
      const [performanceResult, scoreResult] = await Promise.all([
        getTraderPerformance(traderAddress),
        getReputationScore(traderAddress)
      ])
      
      if (performanceResult.success) {
        setState(prev => ({ 
          ...prev, 
          performanceMetrics: performanceResult.data || null
        }))
      }
      
      if (scoreResult.success) {
        setState(prev => ({ 
          ...prev, 
          reputationScore: scoreResult.data || 0
        }))
      }
      
      setState(prev => ({ ...prev, isLoading: false }))
      
      return {
        success: true,
        data: {
          performance: performanceResult.data,
          score: scoreResult.data
        }
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }))
      
      return { success: false, error: errorMessage }
    }
  }, [])

  // Check if trader is verified
  const isVerifiedTrader = useCallback((reputationScore: number): boolean => {
    return reputationScore >= 700
  }, [])

  // Get trader rank based on reputation score
  const getTraderRank = useCallback((score: number): number => {
    // This would be calculated based on the leaderboard
    // For now, return a mock rank
    return Math.max(1, Math.floor((1000 - score) / 10) + 1)
  }, [])

  // Get risk level based on performance metrics
  const getRiskLevel = useCallback((metrics: PerformanceMetrics): "Low" | "Medium" | "High" => {
    if (!metrics.totalTrades || metrics.totalTrades < 10) {
      return "Medium" // Unknown risk for new traders
    }
    
    const winRate = (metrics.profitableTrades / metrics.totalTrades) * 100
    const drawdownRatio = Math.abs(metrics.maxDrawdown) / metrics.totalVolume
    
    if (winRate >= 80 && drawdownRatio <= 0.05) {
      return "Low"
    } else if (winRate >= 60 && drawdownRatio <= 0.15) {
      return "Medium"
    } else {
      return "High"
    }
  }, [])

  // Calculate trader stats
  const calculateTraderStats = useCallback((metrics: PerformanceMetrics) => {
    const totalTrades = metrics.totalTrades
    const profitableTrades = metrics.profitableTrades
    const totalVolume = metrics.totalVolume
    const totalPnL = metrics.total_pnl
    const maxDrawdown = metrics.max_drawdown
    
    return {
      winRate: totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0,
      avgTradeSize: totalTrades > 0 ? totalVolume / totalTrades : 0,
      totalReturn: totalVolume > 0 ? (totalPnL / totalVolume) * 100 : 0,
      maxDrawdownPercent: totalVolume > 0 ? (Math.abs(maxDrawdown) / totalVolume) * 100 : 0,
      profitFactor: totalPnL > 0 ? Math.max(0, 1 + (totalPnL / totalVolume)) : 0,
      riskScore: getRiskLevel(metrics)
    }
  }, [getRiskLevel])

  // Format reputation score with level
  const getReputationLevel = useCallback((score: number) => {
    if (score >= 900) return { level: "Legendary", color: "text-purple-600", icon: "👑" }
    if (score >= 800) return { level: "Expert", color: "text-blue-600", icon: "🏆" }
    if (score >= 700) return { level: "Advanced", color: "text-green-600", icon: "⭐" }
    if (score >= 600) return { level: "Intermediate", color: "text-yellow-600", icon: "📈" }
    if (score >= 500) return { level: "Beginner", color: "text-gray-600", icon: "🌱" }
    return { level: "New", color: "text-gray-500", icon: "🆕" }
  }, [])

  // Setup real-time subscriptions
  const setupSubscriptions = useCallback(() => {
    if (!wallet.address) return

    // Subscribe to performance metrics updates
    const metricsSub = subscribeToTable('performance_metrics', (payload) => {
      console.log('Performance metrics update:', payload)
      
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        const metrics = payload.new
        
        if (metrics.trader_address === wallet.address) {
          // Update current user's metrics
          setState(prev => ({
            ...prev,
            performanceMetrics: {
              totalTrades: metrics.total_trades,
              profitableTrades: metrics.profitable_trades,
              totalVolume: metrics.total_volume,
              total_pnl: metrics.total_pnl,
              max_drawdown: metrics.max_drawdown
            },
            reputationScore: metrics.reputation_score
          }))
          
          toast({
            title: "Performance updated",
            description: `Your trading performance has been updated`
          })
        }
      }
    })

    setSubscriptions([metricsSub])
  }, [wallet.address])

  // Cleanup subscriptions
  const cleanupSubscriptions = useCallback(() => {
    subscriptions.forEach(sub => {
      supabase.removeChannel(sub)
    })
    setSubscriptions([])
  }, [subscriptions])

  // Auto-load when wallet connects
  useEffect(() => {
    if (wallet.connected && wallet.address) {
      loadTraderReputation(wallet.address)
      loadLeaderboard()
      setupSubscriptions()
    } else {
      setState({
        performanceMetrics: null,
        reputationScore: null,
        leaderboard: [],
        isLoading: false,
        error: null
      })
    }

    return () => {
      cleanupSubscriptions()
    }
  }, [wallet.connected, wallet.address, loadTraderReputation, loadLeaderboard, setupSubscriptions, cleanupSubscriptions])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    // State
    performanceMetrics: state.performanceMetrics,
    reputationScore: state.reputationScore,
    leaderboard: state.leaderboard,
    isLoading: state.isLoading,
    error: state.error,
    isWalletConnected: wallet.connected,
    isWalletConnecting: isConnecting,
    walletAddress: wallet.address,

    // Actions
    loadPerformanceMetrics,
    loadReputationScore,
    loadLeaderboard,
    loadTraderReputation,
    clearError,

    // Utilities
    isVerifiedTrader,
    getTraderRank,
    getRiskLevel,
    calculateTraderStats,
    getReputationLevel,

    // Real-time
    setupSubscriptions,
    cleanupSubscriptions
  }
}