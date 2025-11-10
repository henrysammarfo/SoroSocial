"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "./useWallet"
import { 
  createUserProfile, 
  getUserProfile, 
  updateUserProfile,
  followTrader, 
  unfollowTrader,
  getFollowers,
  getFollowing,
  subscribeToTable,
  subscribeToNotifications,
  type ApiResponse
} from "@/lib/api-client"
import { UserProfile } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface SocialHookState {
  profile: UserProfile | null
  followers: string[]
  following: string[]
  isLoading: boolean
  error: string | null
  isFollowing: boolean
}

export function useSocial() {
  const { wallet, isConnecting } = useWallet()
  const [state, setState] = useState<SocialHookState>({
    profile: null,
    followers: [],
    following: [],
    isLoading: false,
    error: null,
    isFollowing: false
  })

  const [subscriptions, setSubscriptions] = useState<any[]>([])

  // Create user profile
  const createProfile = useCallback(async (username: string, bio: string = '') => {
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
      
      const result = await createUserProfile(username, bio)
      
      if (result.success && result.data) {
        setState(prev => ({ 
          ...prev, 
          profile: result.data!.profile, 
          isLoading: false 
        }))
        
        toast({
          title: "Profile created",
          description: `Welcome to SoroSocial, ${username}!`
        })
        
        return { success: true, data: result.data }
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: result.error || "Failed to create profile" 
        }))
        
        toast({
          title: "Profile creation failed",
          description: result.error || "Failed to create profile",
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
        title: "Profile creation failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      return { success: false, error: errorMessage }
    }
  }, [wallet.connected, wallet.address])

  // Load user profile
  const loadProfile = useCallback(async (address?: string) => {
    const targetAddress = address || wallet.address
    
    if (!targetAddress) {
      return { success: false, error: "No address provided" }
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const result = await getUserProfile(targetAddress)
      
      if (result.success && result.data) {
        setState(prev => ({ 
          ...prev, 
          profile: result.data!, 
          isLoading: false 
        }))
        
        return { success: true, data: result.data }
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: result.error || "Profile not found" 
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

  // Update profile
  const updateProfile = useCallback(async (bio: string) => {
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
      
      const result = await updateUserProfile(bio)
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          profile: prev.profile ? { ...prev.profile, bio } : null,
          isLoading: false 
        }))
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully"
        })
        
        return { success: true }
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: result.error || "Failed to update profile" 
        }))
        
        toast({
          title: "Profile update failed",
          description: result.error || "Failed to update profile",
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
        title: "Profile update failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      return { success: false, error: errorMessage }
    }
  }, [wallet.connected, wallet.address])

  // Follow trader
  const followUser = useCallback(async (
    targetAddress: string, 
    enableCopy: boolean = false, 
    allocationPercent: number = 100
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
      
      const result = await followTrader(targetAddress, enableCopy, allocationPercent)
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          isFollowing: true,
          isLoading: false 
        }))
        
        toast({
          title: "User followed",
          description: enableCopy ? "Copy trading enabled" : "You are now following this trader"
        })
        
        return { success: true }
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: result.error || "Failed to follow user" 
        }))
        
        toast({
          title: "Follow failed",
          description: result.error || "Failed to follow user",
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
        title: "Follow failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      return { success: false, error: errorMessage }
    }
  }, [wallet.connected, wallet.address])

  // Unfollow trader
  const unfollowUser = useCallback(async (targetAddress: string) => {
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
      
      const result = await unfollowTrader(targetAddress)
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          isFollowing: false,
          isLoading: false 
        }))
        
        toast({
          title: "User unfollowed",
          description: "You are no longer following this trader"
        })
        
        return { success: true }
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: result.error || "Failed to unfollow user" 
        }))
        
        toast({
          title: "Unfollow failed",
          description: result.error || "Failed to unfollow user",
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
        title: "Unfollow failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      return { success: false, error: errorMessage }
    }
  }, [wallet.connected, wallet.address])

  // Load followers
  const loadFollowers = useCallback(async (address: string) => {
    try {
      const result = await getFollowers(address)
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          followers: result.data || [] 
        }))
        
        return { success: true, data: result.data }
      } else {
        console.error('Failed to load followers:', result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Load followers error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }, [])

  // Load following
  const loadFollowing = useCallback(async (address: string) => {
    try {
      const result = await getFollowing(address)
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          following: result.data || [] 
        }))
        
        return { success: true, data: result.data }
      } else {
        console.error('Failed to load following:', result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Load following error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }, [])

  // Setup real-time subscriptions
  const setupSubscriptions = useCallback(() => {
    if (!wallet.address) return

    // Subscribe to follows table changes
    const followsSub = subscribeToTable('follows', (payload) => {
      console.log('Follows update:', payload)
      // Refresh followers/following if relevant to current user
      if (payload.new?.follower_address === wallet.address || 
          payload.new?.following_address === wallet.address) {
        if (payload.eventType === 'INSERT') {
          loadFollowers(wallet.address)
          loadFollowing(wallet.address)
        } else if (payload.eventType === 'DELETE') {
          loadFollowers(wallet.address)
          loadFollowing(wallet.address)
        }
      }
    })

    // Subscribe to notifications
    const notificationsSub = subscribeToNotifications(wallet.address, (payload) => {
      console.log('New notification:', payload)
      toast({
        title: payload.new.title,
        description: payload.new.message,
      })
    })

    setSubscriptions([followsSub, notificationsSub])
  }, [wallet.address, loadFollowers, loadFollowing])

  // Cleanup subscriptions
  const cleanupSubscriptions = useCallback(() => {
    subscriptions.forEach(sub => {
      supabase.removeChannel(sub)
    })
    setSubscriptions([])
  }, [subscriptions])

  // Auto-load profile when wallet connects
  useEffect(() => {
    if (wallet.connected && wallet.address) {
      loadProfile()
      setupSubscriptions()
    } else {
      setState({
        profile: null,
        followers: [],
        following: [],
        isLoading: false,
        error: null,
        isFollowing: false
      })
    }

    return () => {
      cleanupSubscriptions()
    }
  }, [wallet.connected, wallet.address, loadProfile, setupSubscriptions, cleanupSubscriptions])

  // Load social data when profile is available
  useEffect(() => {
    if (state.profile?.address) {
      loadFollowers(state.profile.address)
      loadFollowing(state.profile.address)
    }
  }, [state.profile?.address, loadFollowers, loadFollowing])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    // State
    profile: state.profile,
    followers: state.followers,
    following: state.following,
    isLoading: state.isLoading,
    error: state.error,
    isFollowing: state.isFollowing,
    isWalletConnected: wallet.connected,
    isWalletConnecting: isConnecting,
    walletAddress: wallet.address,

    // Actions
    createProfile,
    loadProfile,
    updateProfile,
    followUser,
    unfollowUser,
    loadFollowers,
    loadFollowing,
    clearError,

    // Real-time
    setupSubscriptions,
    cleanupSubscriptions
  }
}