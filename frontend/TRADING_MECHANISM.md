# Social Trading App - Trading Mechanism Explained

## What Trades Are Users Copying?

### Overview
When users "copy trade" a trader on this platform, they are copying the trader's **on-chain Stellar blockchain trades**. Here's how it works:

### The Trading Flow

1. **Trader Executes Trades**
   - Professional traders connect their Stellar wallets
   - They execute real trades on the Stellar DEX (Decentralized Exchange)
   - Trades involve buying/selling Stellar assets: XLM, USDC, and other Stellar tokens
   - Each trade is recorded on the Stellar blockchain

2. **Platform Monitors Trades**
   - The smart contract monitors traders' wallet addresses
   - When a trader makes a trade, it's detected in real-time
   - Trade details are captured: asset, action (BUY/SELL), amount, price
   - This data populates the "Live Trades" page

3. **Copy Trading Mechanism**
   - When a user copies a trader with 100 XLM allocated:
     - User deposits 100 XLM into the copy trading smart contract
     - Smart contract watches the trader's wallet for new trades
     - When trader buys 50 USDC with XLM, the contract automatically:
       * Calculates proportional amount based on user's allocation
       * Executes the same trade from the user's deposited funds
       * User now holds the same asset ratio as the trader

4. **What Trades Appear on Trade Page**
   - All trades executed by active traders on Stellar DEX
   - Real blockchain transactions viewable on Stellar Explorer
   - Assets traded: XLM, USDC, AQUA, yXLM, and other Stellar tokens
   - Each trade card shows:
     * Which trader executed it
     * What asset was traded
     * BUY/SELL action
     * Amount and price
     * Current P&L

### Portfolio Holdings

**Holdings Section Shows:**
1. **Copy Trade Positions** - Your allocated XLM copying specific traders
2. **Actual Token Holdings** - Real Stellar assets you hold from copied trades
   - If trader bought USDC, you hold USDC
   - If trader bought AQUA, you hold AQUA
   - All positions update in real-time from blockchain

### Real-Time Updates

- **Live Blockchain Monitoring**: Smart contracts listen for trader transactions
- **Automatic Execution**: Copy trades execute within seconds of original trade
- **Balance Updates**: Your wallet and holdings update immediately
- **P&L Calculation**: Based on current market prices from Stellar DEX

### Integration Points for Backend

\`\`\`typescript
// 1. Monitor trader's wallet for trades
async function listenToTraderTrades(traderAddress: string) {
  // Use Stellar Horizon API to watch trader's account
  // When new payment/trade operation detected, record it
}

// 2. Execute copy trade
async function executeCopyTrade(
  userAddress: string,
  traderTrade: Trade,
  allocationAmount: number
) {
  // Calculate proportional trade amount
  // Submit transaction to Stellar network
  // Update user's holdings
}

// 3. Fetch user's real holdings
async function getUserHoldings(userAddress: string) {
  // Query Stellar account balances
  // Return actual token holdings (XLM, USDC, etc.)
}
\`\`\`

### Summary

Users are copying **real Stellar DEX trades** executed by professional traders. The copy trading smart contract automatically replicates trades proportionally based on user's allocation. Portfolio holdings show both copy positions and actual Stellar tokens held from executed trades.
