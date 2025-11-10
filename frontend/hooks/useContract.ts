"use client"

import { useState, useCallback } from "react"
import { Contract, SorobanRpc, TransactionBuilder, Networks, BASE_FEE } from "@stellar/stellar-sdk"
import { useWallet } from "./useWallet"
import { stellarConfig } from "@/lib/stellar"
import { toast } from "@/hooks/use-toast"

interface ContractCallResult<T = any> {
  success: boolean
  data?: T
  error?: string
  txHash?: string
}

interface ContractHookState {
  isLoading: boolean
  error: string | null
  lastTxHash: string | null
}

export function useContract(contractId?: string) {
  const { wallet, signTransaction } = useWallet()
  const [state, setState] = useState<ContractHookState>({
    isLoading: false,
    error: null,
    lastTxHash: null,
  })

  const sorobanServer = new SorobanRpc.Server(stellarConfig.sorobanRpcUrl)

  const callReadMethod = useCallback(async <T = any>(
    method: string,
    args: any[] = []
  ): Promise<ContractCallResult<T>> => {
    if (!contractId) {
      return { success: false, error: "Contract ID not provided" }
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const contract = new Contract(contractId)

      // Create a dummy account for simulation
      const dummyAccount = await sorobanServer.getAccount("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")

      const transaction = new TransactionBuilder(dummyAccount, {
        fee: BASE_FEE,
        networkPassphrase: stellarConfig.networkPassphrase,
      })
        .addOperation(contract.call(method, ...args))
        .setTimeout(30)
        .build()

      // Simulate the transaction
      const simulation = await sorobanServer.simulateTransaction(transaction)

      if (simulation.error) {
        throw new Error(simulation.error)
      }

      // Decode the result
      const result = simulation.result?.retval

      setState(prev => ({ ...prev, isLoading: false }))

      return { success: true, data: result as T }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }))

      toast({
        title: "Read failed",
        description: errorMessage,
        variant: "destructive",
      })

      return { success: false, error: errorMessage }
    }
  }, [contractId, sorobanServer])

  const callWriteMethod = useCallback(async (
    method: string,
    args: any[] = []
  ): Promise<ContractCallResult> => {
    if (!contractId) {
      return { success: false, error: "Contract ID not provided" }
    }

    if (!wallet.connected || !wallet.address) {
      return { success: false, error: "Wallet not connected" }
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const contract = new Contract(contractId)
      const account = await sorobanServer.getAccount(wallet.address)

      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: stellarConfig.networkPassphrase,
      })
        .addOperation(contract.call(method, ...args))
        .setTimeout(30)
        .build()

      // Sign the transaction
      const signedXdr = await signTransaction(transaction.toXDR())

      // Submit the transaction
      const submitResult = await sorobanServer.sendTransaction(signedXdr)

      if (submitResult.errorResult) {
        throw new Error("Transaction failed")
      }

      const txHash = submitResult.hash

      setState(prev => ({
        ...prev,
        isLoading: false,
        lastTxHash: txHash
      }))

      toast({
        title: "Transaction submitted",
        description: `Transaction hash: ${txHash.slice(0, 8)}...`,
      })

      return { success: true, txHash }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }))

      toast({
        title: "Transaction failed",
        description: errorMessage,
        variant: "destructive",
      })

      return { success: false, error: errorMessage }
    }
  }, [contractId, wallet.connected, wallet.address, sorobanServer, signTransaction])

  const getTransactionStatus = useCallback(async (txHash: string) => {
    try {
      const response = await sorobanServer.getTransaction(txHash)

      return {
        status: response.status,
        result: response.result,
        error: response.errorResult,
      }
    } catch (error) {
      console.error("Failed to get transaction status:", error)
      return null
    }
  }, [sorobanServer])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,
    lastTxHash: state.lastTxHash,

    // Methods
    callReadMethod,
    callWriteMethod,
    getTransactionStatus,
    clearError,
  }
}