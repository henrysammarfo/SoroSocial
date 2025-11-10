# SoroSocial Integration Guide

This guide explains how to integrate the frontend with your Soroban smart contracts and backend.

## Architecture Overview

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│   Frontend  │────▶│  API Routes │────▶│ Soroban Contracts│
│  (v0 UI)    │     │  (Next.js)  │     │   (Rust)         │
└─────────────┘     └─────────────┘     └──────────────────┘
       │                    │                     │
       │                    ▼                     │
       │            ┌─────────────┐              │
       └───────────▶│  Supabase   │◀─────────────┘
                    │  (Database) │
                    └─────────────┘
\`\`\`

## Phase 1: Setup Environment

1. **Copy environment variables**:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. **Configure Stellar Network**:
   - Set `NEXT_PUBLIC_STELLAR_NETWORK` to `testnet` or `mainnet`
   - Set `NEXT_PUBLIC_STELLAR_RPC_URL` to your Soroban RPC endpoint

3. **Deploy Smart Contracts** (use Cursor prompts from your workflow):
   - Deploy `sorosocial_users.rs`
   - Deploy `sorosocial_trading.rs`
   - Deploy `sorosocial_reputation.rs`
   - Add contract IDs to `.env.local`

4. **Setup Supabase**:
   - Create project at supabase.com
   - Add connection string to `DATABASE_URL`
   - Add public keys to `.env.local`

## Phase 2: Create API Routes

All API routes are in `/app/api/`. Create these files:

### User Management
- `app/api/users/create/route.ts` - Create user profile
- `app/api/users/[address]/route.ts` - Get/update user profile
- `app/api/users/[address]/followers/route.ts` - Get followers
- `app/api/users/[address]/following/route.ts` - Get following

### Social Features
- `app/api/social/follow/route.ts` - Follow trader
- `app/api/social/unfollow/route.ts` - Unfollow trader
- `app/api/social/feed/route.ts` - Get social feed
- `app/api/social/trending/route.ts` - Get trending traders

### Trading
- `app/api/trading/execute/route.ts` - Execute trade
- `app/api/trading/setup-copy/route.ts` - Setup copy trading
- `app/api/trading/stop-copy/route.ts` - Stop copy trading
- `app/api/trading/history/route.ts` - Get trade history
- `app/api/trading/performance/route.ts` - Get performance

### Analytics
- `app/api/analytics/leaderboard/route.ts` - Get leaderboard
- `app/api/analytics/trader-performance/route.ts` - Get trader metrics
- `app/api/analytics/stats/route.ts` - Platform statistics

## Phase 3: Implement Smart Contract Calls

Each API route should:

1. **Validate request** using Zod
2. **Call Soroban contract** using Stellar SDK
3. **Update database** (Supabase) for caching
4. **Return response** with proper error handling

### Example API Route Structure:

\`\`\`typescript
// app/api/social/follow/route.ts
import { NextResponse } from "next/server"
import * as StellarSDK from "@stellar/stellar-sdk"
import { z } from "zod"

const schema = z.object({
  targetAddress: z.string(),
  enableCopy: z.boolean(),
  allocationPercent: z.number().min(0).max(100),
})

export async function POST(request: Request) {
  try {
    // 1. Validate request
    const body = await request.json()
    const { targetAddress, enableCopy, allocationPercent } = schema.parse(body)
    
    // 2. Get user wallet (from session/auth)
    const userAddress = "GET_FROM_AUTH" // TODO: Implement auth
    
    // 3. Call Soroban contract
    const server = new StellarSDK.SorobanRpc.Server(
      process.env.NEXT_PUBLIC_STELLAR_RPC_URL!
    )
    
    const contract = new StellarSDK.Contract(
      process.env.NEXT_PUBLIC_USERS_CONTRACT_ID!
    )
    
    const transaction = new StellarSDK.TransactionBuilder(/* ... */)
      .addOperation(
        contract.call(
          "follow_user",
          StellarSDK.xdr.ScVal.scvAddress(targetAddress),
          StellarSDK.xdr.ScVal.scvBool(enableCopy),
          StellarSDK.xdr.ScVal.scvU32(allocationPercent)
        )
      )
      .build()
    
    // 4. Submit transaction
    const result = await server.sendTransaction(transaction)
    
    // 5. Update database
    // TODO: Update Supabase with new follow relationship
    
    // 6. Return success
    return NextResponse.json({
      success: true,
      transactionHash: result.hash,
    })
    
  } catch (error) {
    console.error("Follow error:", error)
    return NextResponse.json(
      { error: "Failed to follow trader" },
      { status: 500 }
    )
  }
}
\`\`\`

## Phase 4: Connect UI Components

The UI components already have placeholder handlers. You just need to:

1. **Import API client functions**:
   \`\`\`typescript
   import { followTrader, setupCopyTrading } from "@/lib/api-client"
   \`\`\`

2. **Call API functions in handlers**:
   \`\`\`typescript
   const handleFollow = async () => {
     setLoading(true)
     const result = await followTrader(traderAddress, true, 100)
     if (result.data) {
       // Update UI state
       setIsFollowing(true)
     }
     setLoading(false)
   }
   \`\`\`

3. **Components to update**:
   - `components/profile-header.tsx` - Follow button
   - `components/feed-card.tsx` - Like, copy, share
   - `components/copy-trade-confirmation.tsx` - Confirm button
   - `components/leaderboard-table.tsx` - Copy buttons
   - `components/active-copies.tsx` - Pause, stop buttons

## Phase 5: Add Real-time Features

Use WebSocket (Pusher/Ably) for live updates:

1. **Subscribe to events**:
   \`\`\`typescript
   useEffect(() => {
     const channel = pusher.subscribe("trades")
     channel.bind("new-trade", (trade) => {
       // Add new trade to feed
       setTrades((prev) => [trade, ...prev])
     })
   }, [])
   \`\`\`

2. **Events to implement**:
   - `new-trade` - New trade executed
   - `new-follower` - Someone followed you
   - `trade-copied` - Your trade was copied
   - `pnl-update` - Portfolio value changed

## Phase 6: Testing

1. **Unit tests** for API routes
2. **Integration tests** for contract calls
3. **E2E tests** for user flows
4. **Load testing** for performance

## Component Integration Checklist

### Landing Page (`app/page.tsx`)
- [x] Hero section
- [x] Feature showcase
- [x] CTA buttons
- [ ] Connect "Get Started" to wallet connection
- [ ] Connect "View Demo" to demo account

### Social Feed (`app/app/page.tsx`)
- [x] Feed display
- [x] Stories bar
- [ ] Connect feed to `/api/social/feed`
- [ ] Add like functionality
- [ ] Add copy trade quick action
- [ ] Add share functionality
- [ ] Implement infinite scroll

### Trader Profile (`app/profile/page.tsx`)
- [x] Profile header
- [x] Stats display
- [x] Trade history
- [ ] Connect follow button to `/api/social/follow`
- [ ] Connect settings to profile update
- [ ] Load real trader data
- [ ] Add share profile

### Copy Trading Setup (`app/trade/page.tsx`)
- [x] Trader selection
- [x] Configuration form
- [x] Confirmation screen
- [ ] Connect to `/api/trading/setup-copy`
- [ ] Add form validation
- [ ] Add transaction signing
- [ ] Show transaction status

### Portfolio (`app/portfolio/page.tsx`)
- [x] Overview stats
- [x] Active copies
- [x] Holdings table
- [ ] Load real portfolio data
- [ ] Connect pause/stop buttons
- [ ] Add withdraw functionality
- [ ] Real-time value updates

### Leaderboard (`app/discover/page.tsx`)
- [x] Leaderboard table
- [x] Trending strategies
- [x] Filters
- [ ] Connect to `/api/analytics/leaderboard`
- [ ] Add sorting
- [ ] Add pagination
- [ ] Quick copy buttons

## User Flows

### New User Flow
1. Land on homepage (`/`)
2. Click "Get Started"
3. Connect Freighter wallet
4. Create profile (username, bio)
5. Redirected to social feed (`/app`)
6. Browse trending traders
7. Follow and copy a trader

### Existing User Flow
1. Auto-connect wallet
2. Load to social feed
3. See trades from followed users
4. Like, comment, copy trades
5. Check portfolio performance
6. Adjust copy trading settings

### Trader Flow
1. Connect wallet
2. Execute trade
3. Followers automatically copy
4. View copier count increase
5. Earn reputation points
6. Climb leaderboard

## Developer Notes

### State Management
- Use React hooks for local state
- Use SWR for server state
- Consider Zustand for global state if needed

### Error Handling
- All API calls have try-catch
- Toast notifications for user feedback
- Proper error messages
- Retry logic for failed transactions

### Performance
- Lazy load images
- Virtualize long lists
- Debounce search inputs
- Cache API responses
- Optimize re-renders

### Security
- Validate all inputs
- Sanitize user content
- Rate limit API calls
- Implement proper auth
- Never expose private keys

## Deployment

1. **Build for production**:
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy to Vercel**:
   - Connect GitHub repository
   - Add environment variables
   - Deploy!

3. **Post-deployment**:
   - Test all user flows
   - Monitor error logs
   - Check performance metrics
   - Update docs

## Support

For issues or questions:
1. Check console logs (look for `[v0]` prefix)
2. Verify environment variables
3. Check Soroban contract deployment
4. Review API route responses
5. Test wallet connection

## Next Steps

1. Complete API route implementation
2. Deploy smart contracts to testnet
3. Test end-to-end flows
4. Add real-time features
5. Polish UI/UX
6. Prepare demo data
7. Deploy to production
8. Launch! 🚀
