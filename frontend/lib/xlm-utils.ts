/**
 * Format XLM amount with proper decimals
 */
export function formatXLM(amount: number, decimals = 2): string {
  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} XLM`
}

/**
 * Format XLM with compact notation for large amounts
 */
export function formatXLMCompact(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M XLM`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K XLM`
  }
  return formatXLM(amount)
}

/**
 * Calculate XLM profit/loss
 */
export function calculateXLMProfit(
  initial: number,
  current: number,
): {
  profit: number
  profitXLM: number
  percentage: number
} {
  const profitXLM = current - initial
  const percentage = ((current - initial) / initial) * 100

  return {
    profit: profitXLM,
    profitXLM,
    percentage,
  }
}

/**
 * Calculate copy trade amount in XLM
 */
export function calculateCopyAmount(traderAmount: number, copyPercentage: number, maxAmount: number): number {
  const calculatedAmount = (traderAmount * copyPercentage) / 100
  return Math.min(calculatedAmount, maxAmount)
}

/**
 * Validate XLM address format
 */
export function isValidXLMAddress(address: string): boolean {
  return /^G[A-Z0-9]{55}$/.test(address)
}

/**
 * Shorten XLM address for display
 */
export function shortenXLMAddress(address: string): string {
  if (!address || address.length < 12) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Calculate trade fee in XLM
 */
export function calculateTradeFee(amount: number, feePercentage = 0.1): number {
  return (amount * feePercentage) / 100
}

/**
 * Get XLM price display with + or - sign
 */
export function getXLMPriceChange(change: number): string {
  const sign = change >= 0 ? "+" : ""
  return `${sign}${change.toFixed(2)}%`
}
