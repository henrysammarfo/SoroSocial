# SoroSocial - Social Trading Platform on Stellar

![SoroSocial Logo](https://via.placeholder.com/800x200/0066cc/ffffff?text=SoroSocial+Social+Trading+Platform)

A cutting-edge social trading platform built on Stellar blockchain using Soroban smart contracts, designed for the Stellar hackathon. SoroSocial combines the best of social media and copy trading, allowing users to follow successful traders and automatically copy their trades.

**🏆 Hackathon-Ready | ⚡ Real-time | 🔐 Blockchain-Integrated | 📱 Mobile-First**

## 🎯 Project Overview

SoroSocial is a comprehensive social trading platform that addresses three key pain points in the crypto trading space:

1. **Information Asymmetry**: New traders struggle to identify profitable strategies
2. **Social Isolation**: Trading is often a solitary activity with no community aspect
3. **Complex Copy Trading**: Existing solutions are fragmented and hard to use

Our solution creates an Instagram-like social experience for trading, where users can:
- Discover and follow successful traders
- Automatically copy trades with customizable allocation percentages
- Build a social network around trading activities
- Earn reputation based on performance
- View real-time P&L updates and social interactions

## ✨ Key Features

### 🔗 Smart Contract Integration
- **3 Soroban Smart Contracts**:
  - `sorosocial_users`: User profiles and social graph management
  - `sorosocial_trading`: Copy trading engine and trade execution
  - `sorosocial_reputation`: Performance tracking and reputation scoring

### 💱 Copy Trading Engine
- **Automatic Trade Execution**: Copy trades from followed traders in real-time
- **Customizable Allocation**: Set 25%, 50%, 75%, or 100% allocation per trader
- **Risk Management**: Stop-loss and take-profit limits
- **Performance Tracking**: Real-time P&L updates and analytics

### 🌍 Social Features
- **Trading Feed**: Instagram-style social feed showing trader activities
- **Stories Bar**: Top traders' daily insights and strategies
- **Social Interactions**: Like, comment, and share trades
- **Following System**: Build and manage trading networks
- **Real-time Notifications**: Live updates on trades and social activity

### 📊 Advanced Analytics
- **Leaderboard System**: Top traders ranked by various metrics
- **Performance Metrics**: Win rate, total return, drawdown, risk score
- **Reputation Scoring**: 0-1000 scale based on trading performance
- **Portfolio Tracking**: Comprehensive view of copy trading positions

### 🔒 Security & Reliability
- **Error Boundaries**: Comprehensive error handling at all levels
- **Real-time Sync**: WebSocket integration for live updates
- **Data Validation**: Input validation and sanitization
- **Access Controls**: Role-based permissions and security

## 🛠️ Technical Architecture

### Frontend Stack
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Zustand** for state management
- **Real-time WebSockets** for live updates

### Backend Integration
- **Supabase** for database and real-time features
- **PostgreSQL** with Row Level Security
- **Next.js API Routes** for server-side operations
- **Real-time subscriptions** for live data

### Blockchain Integration
- **Stellar SDK** for blockchain interactions
- **Soroban Smart Contracts** for on-chain logic
- **Stellar Wallet Kit** for wallet connections
- **Testnet deployment** for development and demo

### Database Schema
```sql
-- Core tables
users              -- User profiles and basic info
follows            -- Social graph relationships
trades             -- Trade history and execution
copy_executions    -- Copy trading records
performance_metrics -- Trader performance data
posts             -- Social media posts
comments          -- Post comments
notifications     -- Real-time notifications
activity_feed     -- Social activity stream
```

## 🚀 Quick Start

### Prerequisites
```bash
# Node.js 18+ and npm
node --version  # v18.0.0+

# Git
git --version

# Optional: Supabase CLI
npm install -g supabase
```

### 1. Clone and Setup
```bash
git clone https://github.com/your-username/sorosocial.git
cd sorosocial

# Install dependencies
cd frontend && npm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.local.example .env.local

# Configure your environment variables:
# - NEXT_PUBLIC_STELLAR_NETWORK=testnet
# - NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
# - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Database Setup
```bash
# Run the SQL schema from supabase-schema.sql
# This creates all necessary tables and RLS policies
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 5. Deploy Smart Contracts (Optional)
```bash
cd ../sorosocial-contracts
node deploy-contracts.js
```

## 📁 Project Structure

```
sorosocial/
├── frontend/                     # Next.js frontend application
│   ├── app/                      # Next.js 15 app router
│   │   ├── api/                  # API routes
│   │   │   ├── admin/            # Admin functionality
│   │   │   ├── social/           # Social features
│   │   │   ├── trading/          # Trading operations
│   │   │   └── users/            # User management
│   │   ├── admin/                # Admin panel
│   │   ├── app/                  # Main app interface
│   │   ├── discover/             # Trader discovery
│   │   ├── profile/              # User profiles
│   │   ├── portfolio/            # Portfolio tracking
│   │   ├── trade/                # Trading interface
│   │   └── setup-profile/        # Profile setup
│   ├── components/               # React components
│   │   ├── ui/                   # Shadcn/ui components
│   │   ├── feed-card.tsx         # Social feed cards
│   │   ├── profile-header.tsx    # Profile components
│   │   └── ...                   # Other components
│   ├── hooks/                    # Custom React hooks
│   │   ├── useWallet.ts          # Wallet management
│   │   ├── useSocial.ts          # Social features
│   │   ├── useTrading.ts         # Trading operations
│   │   └── useReputation.ts      # Reputation system
│   ├── lib/                      # Utility libraries
│   │   ├── api-client.ts         # API integration
│   │   ├── stellar.ts            # Stellar blockchain client
│   │   ├── demo-data.ts          # Demo data seeding
│   │   └── types.ts              # TypeScript types
│   ├── public/                   # Static assets
│   └── package.json
│
├── sorosocial-contracts/         # Soroban smart contracts
│   ├── contracts/                # Rust smart contracts
│   │   ├── sorosocial_users/     # User management contract
│   │   ├── sorosocial_trading/   # Trading engine contract
│   │   └── sorosocial_reputation/ # Reputation system contract
│   ├── frontend/                 # Contract testing UI
│   ├── scripts/                  # Deployment scripts
│   └── package.json
│
├── supabase-schema.sql           # Database schema
├── deploy-contracts.js           # Contract deployment script
├── DEPLOYMENT_GUIDE.md           # Deployment instructions
└── README.md                     # This file
```

## 🎮 Demo Guide

### Getting Started
1. **Visit the Application**: Navigate to your deployed site
2. **Connect Wallet**: Click "Connect Wallet" (Freighter or other Stellar wallet)
3. **Set Up Profile**: Create your trader profile with username and bio
4. **Explore**: Browse the social feed and discover traders

### Key Features to Test
1. **Social Feed** (`/app`)
   - View real-time trading activity
   - Like and comment on trades
   - Follow/unfollow traders
   - Create posts and stories

2. **Discover** (`/discover`)
   - Browse trader leaderboard
   - Filter by performance metrics
   - View trader profiles and stats
   - Start copy trading

3. **Portfolio** (`/portfolio`)
   - Track copy trading performance
   - View active positions
   - Monitor P&L in real-time
   - Adjust copy settings

4. **Admin Panel** (`/admin`)
   - Seed demo data
   - Monitor platform stats
   - Manage database

### Demo Data Seeding
1. Navigate to `/admin`
2. Click "Seed Demo Data"
3. Wait for completion (30-60 seconds)
4. Explore the populated social trading platform

## 🔧 Development

### Available Scripts
```bash
# Frontend development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Contract development
cd ../sorosocial-contracts
yarn build:contracts # Build all contracts
yarn deploy:testnet  # Deploy to testnet
yarn test:contracts  # Run contract tests
```

### Code Quality
- **TypeScript**: Strict mode enabled
- **ESLint**: Comprehensive linting rules
- **Prettier**: Code formatting
- **Error Boundaries**: Comprehensive error handling
- **Testing**: Unit and integration tests

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Performance

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimization Features
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: Static generation and ISR
- **Real-time**: WebSocket connections for live updates

## 🔐 Security

### Smart Contract Security
- **Access Controls**: Role-based permissions
- **Input Validation**: Comprehensive validation
- **Error Handling**: Custom error types
- **Event Logging**: Full audit trail

### Frontend Security
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: CSRF tokens
- **SQL Injection**: Parameterized queries
- **Data Sanitization**: Input sanitization

### Database Security
- **Row Level Security**: Supabase RLS policies
- **Authentication**: JWT-based auth
- **Encryption**: Data encryption at rest
- **Monitoring**: Real-time security monitoring

## 🚀 Deployment

### Vercel Deployment
1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Configure Environment**: Set all required environment variables
3. **Deploy**: Automatic deployment on git push
4. **Domain**: Optional custom domain setup

### Environment Variables
```env
# Required for production
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
DATABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEMO_SEED_DATA=true
```

### Performance Monitoring
- **Vercel Analytics**: Built-in performance tracking
- **Error Tracking**: Sentry integration (optional)
- **Database Monitoring**: Supabase dashboard
- **Real-time Monitoring**: WebSocket connection health

## 📈 Roadmap

### Phase 1 (Current - Hackathon Demo)
- [x] Basic social trading functionality
- [x] Smart contract integration
- [x] Real-time features
- [x] Admin panel and demo data

### Phase 2 (Post-Hackathon)
- [ ] Mainnet deployment
- [ ] Advanced trading features
- [ ] Mobile app development
- [ ] Advanced analytics and AI

### Phase 3 (Future)
- [ ] Multi-chain support
- [ ] DeFi protocol integration
- [ ] NFT trading features
- [ ] Governance token

## 🤝 Team

**SoroSocial Development Team**
- **Frontend**: Next.js, React, TypeScript
- **Smart Contracts**: Rust, Soroban
- **Backend**: Supabase, PostgreSQL
- **Blockchain**: Stellar, Soroban
- **Design**: UI/UX, Mobile-first

## 📄 License

This project is built for the Stellar hackathon and is available under the MIT License.

## 🙏 Acknowledgments

- **Stellar Development Foundation** for the amazing blockchain platform
- **Scaffold Stellar** for the excellent development framework
- **Supabase** for the powerful backend infrastructure
- **Shadcn** for the beautiful component library
- **Vercel** for seamless deployment

## 📞 Support

- **Documentation**: See DEPLOYMENT_GUIDE.md
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Stellar Discord**: https://discord.gg/stellardev

---

<div align="center">

**SoroSocial** - *Copy the best. Trade with confidence.*

Built with ❤️ for the Stellar hackathon

[Website](https://your-domain.vercel.app) • [GitHub](https://github.com/your-username/sorosocial) • [Discord](https://discord.gg/stellardev)

</div>