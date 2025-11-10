"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "./useWallet"
import { 
  executeTradeAPI,
  getTradeHistory,
  subscribeToTable,
  type ApiResponse
} from "@/lib/api-client"
import { Trade, ActiveCopyTrade, CopyTradeConfig } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface TradingHookState {
  trades: Trade[]
  activeCopyTrades: ActiveCopyTrade[]
  isLoading: boolean
  error: string | null
  lastTradeId: string | null
}

export function useTrading() {
  const { wallet, isConnecting } = useWallet()
  const [state, setState] = useState<TradingHookState>({
    trades: [],
    activeCopyTrades: [],
    isLoading: false,
    error: null,
    lastTradeId: null
  })

  const [subscriptions, setSubscriptions] = useState<any[]>([])

  // Execute a trade
  const executeTrade = useCallback(async (
    tokenIn: string,
    tokenOut: string,
    amountIn: number,
    minAmountOut: number
  ) => {
    if (!wallet.connected || !wallet.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      })
      return { success: false, error: "Wallet not connected" }
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const result = await executeTradeAPI(tokenIn, tokenOut, amountIn, minAmountOut)
      
      if (result.success && result.data) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          lastTradeId: result.data!.tradeId
        }))
        
        toast({
          title: "Trade executed",
          description: `Trade ${result.data!.tradeId} submitted successfully`
        })
        
        // Refresh trade history
        loadTradeHistory()
        
        return { success: true, data: result.data }
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: result.error || "Failed to execute trade" 
        }))
        
        toast({
          title: "Trade failed",
          description: result.error || "Failed to execute trade",
          variant: "destructive"
        })
        
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }))
      
      toast({
        title: "Trade failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      return { success: false, error: errorMessage }
    }
  }, [wallet.connected, wallet.address])

  // Load trade history
  const loadTradeHistory = useCallback(async (address?: string) => {
    const traderAddress = address || wallet.address
    
    if (!traderAddress) {
      return { success: false, error: "No address provided" }
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const result = await getTradeHistory(traderAddress, 50, 0)
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          trades: result.data || [], 
          isLoading: false 
        }))
        
        return { success: true, data: result.data }
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: result.error || "Failed to load trade history" 
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
  }, [wallet.address])

  // Start copy trading (simplified - would integrate with contracts)
  const startCopyTrade = useCallback(async (config: CopyTradeConfig) => {
    if (!wallet.connected || !wallet.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      })
      return { success: false, error: "Wallet not connected" }
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // TODO: Implement copy trading contract call
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const copyTradeId = `copy_${Date.now()}`
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        activeCopyTrades: [
          ...prev.activeCopyTrades,
          {
            id: copyTradeId,
            trader: {
              id: config.traderId,
              address: config.traderId,
              username: 'Unknown Trader',
              displayName: 'Unknown Trader',
              avatar: '/placeholder-user.jpg',
              verified: false,
              bio: '',
              followers: 0,
              following: 0,
              copiers: 0,
              totalReturn: 0,
              winRate: 0,
              avgReturn: 0,
              riskScore: 0,
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
                profitFactor: 0
              }
            },
            invested: config.investmentAmount,
            currentValue: config.investmentAmount,
            profit: 0,
            profitPercent: 0,
            copyRatio: config.copyRatio,
            status: 'active',
            startedAt: Date.now()
          }
        ]
      }))
      
      toast({
        title: "Copy trading started",
        description: `Copying trades from ${config.traderId} with ${config.copyRatio}% allocation`
      })
      
      return { success: true, data: { copyTradeId } }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }))
      
      toast({
        title: "Copy trading setup failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      return { success: false, error: errorMessage }
    }
  }, [wallet.connected, wallet.address])

  // Stop copy trading
  const stopCopyTrade = useCallback(async (copyTradeId: string) => {
    if (!wallet.connected || !wallet.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      })
      return { success: false, error: "Wallet not connected" }
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // TODO: Implement stop copy trading contract call
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        activeCopyTrades: prev.activeCopyTrades.filter(ct => ct.id !== copyTradeId)
      }))
      
      toast({
        title: "Copy trading stopped",
        description: "Copy trading has been stopped successfully"
      })
      
      return { success: true }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }))
      
      toast({
        title: "Stop copy trading failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      return { success: false, error: errorMessage }
    }
  }, [wallet.connected, wallet.address])

  // Pause copy trading
  const pauseCopyTrade = useCallback(async (copyTradeId: string) => {
    if (!wallet.connected || !wallet.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      })
      return { success: false, error: "Wallet not connected" }
    }

    try {
      setState(prev => ({ 
        ...prev, 
        activeCopyTrades: prev.activeCopyTrades.map(ct => 
          ct.id === copyTradeId 
            ? { ...ct, status: 'paused' as const }
            : ct
        )
      }))
      
      toast({
        title: "Copy trading paused",
        description: "Copy trading has been paused"
      })
      
      return { success: true }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState(prev => ({ ...prev, error: errorMessage }))
      
      toast({
        title: "Pause copy trading failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      return { success: false, error: errorMessage }
    }
  }, [wallet.connected, wallet.address])

  // Resume copy trading
  const resumeCopyTrade = useCallback(async (copyTradeId: string) => {
    if (!wallet.connected || !wallet.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      })
      return { success: false, error: "Wallet not connected" }
    }

    try {
      setState(prev => ({ 
        ...prev, 
        activeCopyTrades: prev.activeCopyTrades.map(ct => 
          ct.id === copyTradeId 
            ? { ...ct, status: 'active' as const }
            : ct
        )
      }))
      
      toast({
        title: "Copy trading resumed",
        description: "Copy trading has been resumed"
      })
      
      return { success: true }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState(prev => ({ ...prev, error: errorMessage }))
      
      toast({
        title: "Resume copy trading failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      return { success: false, error: errorMessage }
    }
  }, [wallet.connected, wallet.address])

  // Setup real-time subscriptions
  const setupSubscriptions = useCallback(() => {
    if (!wallet.address) return

    // Subscribe to trades table changes
    const tradesSub = subscribeToTable('trades', (payload) => {
      console.log('Trades update:', payload)
      
      if (payload.eventType === 'INSERT') {
        // Add new trade to the list
        const newTrade = payload.new
        setState(prev => ({
          ...prev,
          trades: [
            {
              id: newTrade.trade_id,
              traderId: newTrade.trader_address,
              traderName: 'Unknown Trader',
              traderUsername: 'unknown',
              traderAvatar: '/placeholder-user.jpg',
              traderVerified: false,
              tokenIn: newTrade.token_in,
              tokenOut: newTrade.token_out,
              amountIn: newTrade.amount_in,
              amountOut: newTrade.amount_out,
              minAmountOut: newTrade.min_amount_out,
              profit: newTrade.pnl,
              profitPercent: 0,
              timestamp: new Date(newTrade.timestamp).getTime(),
              status: newTrade.status,
              likes: 0,
              comments: 0,
              copies: 0
            },
            ...prev.trades
          ]
        }))
      }
    })

    // Subscribe to copy executions
    const copyExecutionsSub = subscribeToTable('copy_executions', (payload) => {
      console.log('Copy execution update:', payload)
      
      if (payload.eventType === 'INSERT') {
        const execution = payload.new
        if (execution.copier_address === wallet.address) {
          // This is a copy execution for the current user
          toast({
            title: "Trade copied",
            description: `Your copy trade was executed with ${execution.pnl >= 0 ? '+' : ''}${execution.pnl} P&L`
          })
        }
      }
    })

    setSubscriptions([tradesSub, copyExecutionsSub])
  }, [wallet.address])

  // Cleanup subscriptions
  const cleanupSubscriptions = useCallback(() => {
    subscriptions.forEach(sub => {
      supabase.removeChannel(sub)
    })
    setSubscriptions([])
  }, [subscriptions])

  // Auto-load trade history when wallet connects
  useEffect(() => {
    if (wallet.connected && wallet.address) {
      loadTradeHistory()
      setupSubscriptions()
    } else {
      setState({
        trades: [],
        activeCopyTrades: [],
        isLoading: false,
        error: null,
        lastTradeId: null
      })
    }

    return () => {
      cleanupSubscriptions()
    }
  }, [wallet.connected, wallet.address, loadTradeHistory, setupSubscriptions, cleanupSubscriptions])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Simulate copy trade performance updates
  useEffect(() => {
    if (state.activeCopyTrades.length > 0) {
      const interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          activeCopyTrades: prev.activeCopyTrades.map(ct => {
            if (ct.status === 'active') {
              const pnl = (Math.random() - 0.5) * ct.invested * 0.1 // ±5% random
              const profitPercent = (pnl / ct.invested) * 100
              
              return {
                ...ct,
                currentValue: ct.invested + pnl,
                profit: pnl,
                profitPercent
              }
            }
            return ct
          })
        }))
      }, 5000) // Update every 5 seconds

      return () => clearInterval(interval)
    }
  }, [state.activeCopyTrades.length])

  return {
    // State
    trades: state.trades,
    activeCopyTrades: state.activeCopyTrades,
    isLoading: state.isLoading,
    error: state.error,
    lastTradeId: state.lastTradeId,
    isWalletConnected: wallet.connected,
    isWalletConnecting: isConnecting,
    walletAddress: wallet.address,

    // Actions
    executeTrade,
    loadTradeHistory,
    startCopyTrade,
    stopCopyTrade,
    pauseCopyTrade,
    resumeCopyTrade,
    clearError,

    // Real-time
    setupSubscriptions,
    cleanupSubscriptions
  }
}