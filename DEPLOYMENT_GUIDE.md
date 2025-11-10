# SoroSocial Deployment Guide 🚀

Complete guide to deploying SoroSocial social trading platform for the hackathon.

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Supabase database created and schema applied
- [ ] Environment variables configured
- [ ] Demo data seeded (optional)
- [ ] Smart contracts deployed to Stellar testnet

### ✅ Frontend Preparation
- [ ] All dependencies installed
- [ ] TypeScript compilation successful
- [ ] Build optimization configured
- [ ] Error boundaries implemented
- [ ] Real-time features tested

## 🔧 1. Smart Contract Deployment

### Prerequisites
```bash
# Install Stellar CLI
cargo install --locked stellar-cli --features opt

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32v1-none
```

### Deploy to Stellar Testnet
```bash
# Navigate to contracts directory
cd sorosocial-contracts

# Set environment variables
export STELLAR_NETWORK=testnet
export ADMIN_SECRET_KEY=your_secret_key

# Build and deploy all contracts
node deploy-contracts.js

# Alternative: Use the package scripts
yarn deploy:testnet
```

### Verify Deployment
```bash
# Check contract status
curl -s "https://soroban-testnet.stellar.org/account/your_admin_address" | jq

# Test contract interaction
stellar contract invoke --network testnet --source your_secret --contract-id contract_id -- get_version
```

## 🗄️ 2. Database Setup (Supabase)

### Apply Database Schema
```bash
# Connect to your Supabase project
# Run the SQL schema from supabase-schema.sql
# This creates all necessary tables and RLS policies
```

### Verify Tables Created
```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verify RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies;
```

## 🌐 3. Frontend Configuration

### Environment Variables (.env.local)
```env
# Network Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org

# Database
DATABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Contract Addresses (after deployment)
NEXT_PUBLIC_SOROSOCIAL_USERS_CONTRACT=contract_id_1
NEXT_PUBLIC_SOROSOCIAL_TRADING_CONTRACT=contract_id_2
NEXT_PUBLIC_SOROSOCIAL_REPUTATION_CONTRACT=contract_id_3

# Demo Mode
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEMO_SEED_DATA=true
```

### Install Dependencies
```bash
cd frontend
npm install @supabase/supabase-js --legacy-peer-deps
npm install
```

## 🏗️ 4. Build and Test Locally

### Development Build
```bash
cd frontend
npm run dev
```

### Production Build
```bash
# Build the application
npm run build

# Test the build locally
npm start
```

### Type Checking
```bash
npm run type-check
npm run lint
```

## 🚀 5. Deploy to Vercel

### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option B: GitHub Integration
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables in Vercel
```bash
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
DATABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEMO_SEED_DATA=true
```

## 🧪 6. Post-Deployment Testing

### Health Check Endpoints
```bash
# Test API routes
curl https://your-domain.vercel.app/api/admin/demo-seed

# Check database connection
curl https://your-domain.vercel.app/api/users/create -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","bio":"test user"}'
```

### Manual Testing Checklist
- [ ] Landing page loads correctly
- [ ] Wallet connection works
- [ ] User profile creation
- [ ] Following/unfollowing traders
- [ ] Trade execution simulation
- [ ] Real-time updates via WebSockets
- [ ] Admin panel demo data seeding
- [ ] Mobile responsiveness
- [ ] Dark mode functionality

## 🎯 7. Demo Preparation

### Seed Demo Data
1. Navigate to `/admin` on your deployed site
2. Click "Seed Demo Data"
3. Wait for confirmation (may take 30-60 seconds)
4. Verify data was created successfully

### Demo Flow Script
```
1. Landing Page (0-30s)
   - Show professional design
   - Highlight key features
   - "Get Started" button

2. Social Feed (30s-1m)
   - Display trading activity feed
   - Show trader stories
   - Demonstrate social features

3. Discover Traders (1m-1m30s)
   - Leaderboard with performance metrics
   - Filter and search functionality
   - Quick copy trade setup

4. Copy Trading (1m30s-2m30s)
   - Show copy trade configuration
   - Real-time P&L updates
   - Portfolio tracking

5. Social Features (2m30s-3m30s)
   - Posts and comments
   - Following system
   - Notifications

6. Technical Backend (3m30s-4m30s)
   - Show admin panel
   - Smart contract interactions
   - Real-time database updates

7. Q&A and Wrap-up (4m30s-5m)
   - Address questions
   - Technical implementation details
   - Future roadmap
```

## 🔍 8. Performance Optimization

### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

### Image Optimization
- Images are optimized by Next.js automatically
- Use WebP format when possible
- Implement lazy loading for better performance

### Code Splitting
- Routes are automatically code-split
- Components use dynamic imports where appropriate
- Reduce initial bundle size

## 📊 9. Monitoring and Analytics

### Vercel Analytics
- Already configured in the app
- Monitor page views, Core Web Vitals
- Track user interactions

### Error Monitoring
- Sentry integration (optional)
- Real-time error tracking
- Performance monitoring

### Database Monitoring
- Supabase dashboard monitoring
- Query performance tracking
- Real-time connection monitoring

## 🛠️ 10. Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear npm cache
npm cache clean --force
npm install
```

**Database Connection Issues**
- Verify environment variables
- Check Supabase project status
- Validate RLS policies

**Wallet Connection Problems**
- Test with Freighter extension
- Verify network settings
- Check Stellar RPC endpoint

**Real-time Features Not Working**
- Verify WebSocket URL configuration
- Check Supabase real-time settings
- Test in incognito mode

### Emergency Rollback
```bash
# Vercel rollback
vercel rollback [deployment-url]

# Revert to previous version
vercel alias set old-deployment-url your-domain.vercel.app
```

## 📞 11. Support Contacts

### Technical Support
- **Stellar Discord**: https://discord.gg/stellardev
- **Scaffold Stellar**: https://scaffoldstellar.org/
- **Supabase Support**: https://supabase.com/support

### Platform Status
- **Vercel Status**: https://vercel-status.com/
- **Stellar Network**: https://status.stellar.org/
- **Supabase Status**: https://status.supabase.com/

## ✅ Final Verification Checklist

Before the demo, verify:
- [ ] All pages load without errors
- [ ] Wallet connection works smoothly
- [ ] Demo data seeded and populated
- [ ] Social features functional
- [ ] Copy trading simulation works
- [ ] Real-time updates working
- [ ] Mobile version tested
- [ ] Admin panel accessible
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Dark mode works
- [ ] Navigation smooth
- [ ] Loading states implemented
- [ ] Error boundaries active

## 🎉 Launch Sequence

1. **Pre-Launch** (T-30 minutes)
   - Verify all systems operational
   - Seed demo data if not done
   - Test critical user flows

2. **Launch** (T-0)
   - Deploy to Vercel
   - Run health checks
   - Update DNS if custom domain

3. **Post-Launch** (T+15 minutes)
   - Monitor performance
   - Check error rates
   - Verify real-time features

4. **Demo Ready** (T+30 minutes)
   - Platform fully operational
   - Demo data populated
   - Team familiar with flows

---

**🎯 Remember**: The goal is to demonstrate a working social trading platform that showcases:
- Smart contract integration with Stellar/Soroban
- Real-time social features
- Copy trading simulation
- Professional UI/UX
- Scalable architecture

**Time to show the judges what SoroSocial can do! 🚀**