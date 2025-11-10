# Cursor AI Prompt for TradeSocial Development

Use this prompt in Cursor AI to get optimal assistance when developing TradeSocial features.

## Initial Context Prompt

\`\`\`
You are an expert full-stack developer working on TradeSocial, a social copy trading platform built on Stellar blockchain. The app allows users to follow and copy top traders' strategies in real-time.

TECH STACK:
- Frontend: Next.js 16 (App Router), React 19, TypeScript
- Styling: Tailwind CSS v4, shadcn/ui components
- State: Zustand for global state management
- Blockchain: Stellar Network, Soroban Smart Contracts
- Database: Supabase (PostgreSQL) or localStorage for MVP
- APIs: Next.js Route Handlers

KEY ARCHITECTURE:
- Client-side state persisted to localStorage
- Server components for pages, client components for interactions
- Protected routes via ProtectedRoute wrapper
- Real-time copy trading with configurable parameters
- Social feed with posts, stories, comments, and interactions

IMPORTANT FILES:
- lib/store.ts - Global state management (users, traders, trades, feed)
- lib/types.ts - TypeScript interfaces and types
- lib/stellar.ts - Stellar blockchain integration utilities
- lib/local-db.ts - localStorage persistence layer
- components/ - Reusable UI components
- app/ - Next.js 16 pages using App Router

CODING STANDARDS:
1. Always use TypeScript with strict typing
2. Prefer server components unless interactivity is needed
3. Use Zustand store for global state, not React Context
4. Follow shadcn/ui patterns for components
5. Use Tailwind CSS with semantic classes
6. Add proper error handling and user feedback (toast notifications)
7. Implement loading states for async operations
8. Ensure mobile-responsive design

CURRENT FEATURES:
- Wallet connection (Freighter, Albedo)
- User authentication and profile setup
- Social feed (posts, stories, comments, likes)
- Trader discovery with filters and search
- Copy trading system with configuration
- Portfolio tracking and P&L calculation
- Trade history and analytics
- Admin dashboard for management
- Reporting and moderation system

When I ask you to implement features:
1. Ask clarifying questions if requirements are unclear
2. Suggest the best approach considering Stellar blockchain integration
3. Provide complete, working code with proper TypeScript types
4. Include error handling and edge cases
5. Add comments for complex logic
6. Suggest testing approaches
7. Consider security and data privacy
\`\`\`

## Feature-Specific Prompts

### Adding New Trading Features
\`\`\`
I want to add [FEATURE NAME] to the trading system.

Context:
- Current trading mechanism: [describe if needed]
- Integration points: Stellar DEX, Soroban contracts
- State management: Zustand store at lib/store.ts

Requirements:
1. [List your requirements]
2. Should integrate with existing copy trading system
3. Must persist data across sessions
4. Include proper error handling

Please provide:
- Updated TypeScript types in lib/types.ts
- Store methods in lib/store.ts
- UI components needed
- Any API routes required
- Stellar/Soroban integration code
\`\`\`

### Creating New UI Components
\`\`\`
I need a new component for [COMPONENT PURPOSE].

Design Requirements:
- Should match existing shadcn/ui style
- Mobile-responsive
- Accessible (ARIA labels, keyboard navigation)
- Support light/dark theme

Functionality:
1. [List functionality]
2. [State management approach]
3. [Data source]

Please provide:
- Complete component code
- TypeScript props interface
- Usage example
- Any required store updates
\`\`\`

### Implementing Smart Contract Integration
\`\`\`
I need to integrate [CONTRACT FUNCTION] with the frontend.

Contract Details:
- Contract ID: [if known]
- Function: [function name]
- Parameters: [list parameters]
- Expected return: [describe]

Requirements:
1. Call from [where - server/client]
2. Handle errors gracefully
3. Show loading state during transaction
4. Confirm on Stellar blockchain

Please provide:
- Stellar SDK integration code
- Type definitions for contract interface
- UI components for transaction flow
- Error handling logic
\`\`\`

### Debugging Issues
\`\`\`
I'm experiencing [ISSUE DESCRIPTION].

Error Message:
[Paste error message]

What I've Tried:
1. [Step 1]
2. [Step 2]

Context:
- Page/Component: [file path]
- State management: [relevant store methods]
- Expected behavior: [describe]
- Actual behavior: [describe]

Relevant Code:
[Paste code snippet]

Please help me:
1. Identify the root cause
2. Provide a fix with explanation
3. Suggest ways to prevent similar issues
\`\`\`

### Database Queries and API Routes
\`\`\`
I need to [OPERATION] data for [FEATURE].

Data Structure:
- Table/Collection: [name]
- Fields: [list fields with types]
- Relationships: [describe]

Requirements:
1. [Query/mutation requirements]
2. [Authorization/security]
3. [Performance considerations]

Please provide:
- SQL schema (if new table)
- API route handler code
- Client-side fetch logic
- TypeScript types
- Error handling
\`\`\`

## Best Practices Reminders

Always include in your requests:
- "Follow TradeSocial coding standards"
- "Ensure mobile-responsive design"
- "Add proper TypeScript types"
- "Include error handling"
- "Consider security implications"
- "Persist to localStorage/Supabase"

## Quick Command Prompts

### "Review my code"
\`\`\`
Review this code for:
1. TypeScript type safety
2. React best practices
3. Security issues
4. Performance optimizations
5. Stellar integration correctness

[Paste code]
\`\`\`

### "Add feature to existing component"
\`\`\`
Add [FEATURE] to [COMPONENT] at [FILE PATH].

Current code:
[Paste component code]

Requirements:
[List requirements]

Maintain existing functionality and styling.
\`\`\`

### "Fix TypeScript errors"
\`\`\`
I have TypeScript errors in [FILE]:

[Paste errors]

Code:
[Paste code]

Please fix while maintaining type safety.
\`\`\`

### "Optimize performance"
\`\`\`
This [COMPONENT/FUNCTION] is slow:

[Paste code]

Please optimize for:
1. Render performance
2. Memory usage
3. Network requests
4. State updates
\`\`\`

## Integration Testing Prompts

\`\`\`
Help me test [FEATURE] with:

Test Scenarios:
1. [Happy path]
2. [Error case 1]
3. [Error case 2]
4. [Edge case]

Please provide:
- Test setup code
- Mock data
- Assertions to check
- How to run tests
\`\`\`

## Deployment Prompts

\`\`\`
I'm deploying TradeSocial to [PLATFORM].

Help me with:
1. Environment variable setup
2. Build configuration
3. Database migration
4. Stellar network configuration
5. Smart contract deployment

Current status: [describe]
\`\`\`

## Usage Tips

1. **Be Specific**: Include file paths, function names, and exact requirements
2. **Provide Context**: Share relevant code snippets and error messages
3. **Ask Follow-ups**: Request explanations for complex suggestions
4. **Iterate**: Refine solutions with additional prompts
5. **Reference Docs**: Mention if you want Stellar/Soroban best practices

## Example Workflow

\`\`\`
# 1. Start with context
[Initial Context Prompt]

# 2. Define feature
"I want to add a leaderboard widget to the discover page showing top 10 traders"

# 3. Get implementation
[Cursor provides code]

# 4. Refine
"Can you add filters for timeframe (7d, 30d, all-time)?"

# 5. Test
"How do I test this with mock data?"

# 6. Deploy
"What environment variables does this need?"
\`\`\`

This prompt structure ensures Cursor AI understands your codebase and provides consistent, high-quality assistance.
