"use client"

import { useState, useEffect } from "react"
import { WalletNetwork, WalletType, StellarWalletsKit } from "@stellar/wallet-sdk"
import { toast } from "@/hooks/use-toast"

interface WalletState {
  connected: boolean
  address: string | null
  balance: number
  network: WalletNetwork
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
    network: WalletNetwork.TESTNET,
  })

  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize Stellar Wallets Kit
  const kit = new StellarWalletsKit({
    network: wallet.network,
    selectedWallet: WalletType.FREIGHTER,
    modules: [
      // Add wallet modules as needed
    ],
  })

  const connect = async () => {
    try {
      setIsConnecting(true)
      setError(null)

      // Get available wallets
      const availableWallets = kit.getAvailableWallets()

      if (availableWallets.length === 0) {
        throw new Error("No Stellar wallets found. Please install Freighter or another Stellar wallet.")
      }

      // Connect to the first available wallet (typically Freighter)
      const { address } = await kit.connect()

      // Get account balance
      const balance = await getAccountBalance(address)

      setWallet({
        connected: true,
        address,
        balance,
        network: wallet.network,
      })

      toast({
        title: "Wallet connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet"
      setError(errorMessage)

      toast({
        title: "Connection failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setWallet({
      connected: false,
      address: null,
      balance: 0,
      network: wallet.network,
    })

    setError(null)

    toast({
      title: "Wallet disconnected",
      description: "You've been signed out.",
    })
  }

  const getAccountBalance = async (address: string): Promise<number> => {
    try {
      // This would integrate with Stellar SDK to get balance
      // For now, return mock balance
      return 10000
    } catch (error) {
      console.error("Failed to get balance:", error)
      return 0
    }
  }

  const switchNetwork = (network: WalletNetwork) => {
    setWallet(prev => ({
      ...prev,
      network,
    }))

    // Reconnect if already connected
    if (wallet.connected) {
      disconnect()
    }
  }

  const signTransaction = async (xdr: string): Promise<string> => {
    if (!wallet.connected || !wallet.address) {
      throw new Error("Wallet not connected")
    }

    try {
      const signedXdr = await kit.signTransaction(xdr, {
        address: wallet.address,
        networkPassphrase: wallet.network === WalletNetwork.TESTNET
          ? "Test SDF Network ; September 2015"
          : "Public Global Stellar Network ; September 2015",
      })

      return signedXdr
    } catch (error) {
      console.error("Failed to sign transaction:", error)
      throw new Error("Transaction signing failed")
    }
  }

  const signAuthEntry = async (entryXdr: string): Promise<string> => {
    if (!wallet.connected || !wallet.address) {
      throw new Error("Wallet not connected")
    }

    try {
      const signedEntry = await kit.signAuthEntry(entryXdr, {
        address: wallet.address,
        networkPassphrase: wallet.network === WalletNetwork.TESTNET
          ? "Test SDF Network ; September 2015"
          : "Public Global Stellar Network ; September 2015",
      })

      return signedEntry
    } catch (error) {
      console.error("Failed to sign auth entry:", error)
      throw new Error("Auth entry signing failed")
    }
  }

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      try {
        const storedAddress = localStorage.getItem("stellar_wallet_address")
        const storedNetwork = localStorage.getItem("stellar_wallet_network") as WalletNetwork

        if (storedAddress && storedNetwork) {
          const balance = await getAccountBalance(storedAddress)

          setWallet({
            connected: true,
            address: storedAddress,
            balance,
            network: storedNetwork || WalletNetwork.TESTNET,
          })
        }
      } catch (error) {
        console.error("Auto-connect failed:", error)
        // Clear stored data if auto-connect fails
        localStorage.removeItem("stellar_wallet_address")
        localStorage.removeItem("stellar_wallet_network")
      }
    }

    autoConnect()
  }, [])

  // Store wallet state in localStorage
  useEffect(() => {
    if (wallet.connected && wallet.address) {
      localStorage.setItem("stellar_wallet_address", wallet.address)
      localStorage.setItem("stellar_wallet_network", wallet.network)
    } else {
      localStorage.removeItem("stellar_wallet_address")
      localStorage.removeItem("stellar_wallet_network")
    }
  }, [wallet.connected, wallet.address, wallet.network])

  return {
    wallet,
    isConnecting,
    error,
    connect,
    disconnect,
    switchNetwork,
    signTransaction,
    signAuthEntry,
  }
}