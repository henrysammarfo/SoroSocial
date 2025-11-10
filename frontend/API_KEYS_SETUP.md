# API Keys and Environment Variables Setup Guide

This guide will walk you through obtaining all necessary API keys and setting up your environment variables for the TradeSocial platform.

## Required API Keys and Secrets

### 1. Stellar Network Configuration

#### Stellar Horizon API
- **What**: Connect to Stellar blockchain network
- **Required**: Yes
- **Cost**: Free

**Setup Steps:**
1. For testnet (development):
   - URL: `https://horizon-testnet.stellar.org`
   - No API key required
   
2. For mainnet (production):
   - URL: `https://horizon.stellar.org`
   - Consider using SDF's public Horizon or run your own

**Environment Variable:**
\`\`\`env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
\`\`\`

#### Stellar Private Key (Admin/Platform Wallet)
- **What**: Your platform's Stellar wallet for managing fees and operations
- **Required**: Yes
- **Security**: CRITICAL - Never expose this

**Setup Steps:**
1. Create a new Stellar account:
   \`\`\`bash
   # Install Stellar SDK
   npm install stellar-sdk
   
   # Generate new keypair (run this in a secure Node.js script)
   const StellarSdk = require('stellar-sdk');
   const pair = StellarSdk.Keypair.random();
   console.log('Public Key:', pair.publicKey());
   console.log('Secret Key:', pair.secret());
   \`\`\`

2. Fund your testnet account:
   - Visit: https://laboratory.stellar.org/#account-creator?network=test
   - Enter your public key
   - Click "Get test network lumens"

3. For mainnet:
   - Purchase XLM from an exchange
   - Transfer to your newly created wallet
   - Keep at least 5 XLM for minimum balance and fees

**Environment Variables:**
\`\`\`env
STELLAR_ADMIN_SECRET_KEY=S...YOUR_SECRET_KEY_HERE
STELLAR_ADMIN_PUBLIC_KEY=G...YOUR_PUBLIC_KEY_HERE
\`\`\`

### 2. Soroban Smart Contract Deployment

#### Contract IDs
After deploying your Soroban smart contracts, you'll need to add their contract IDs.

**Setup Steps:**
1. Deploy contracts using Stellar CLI:
   \`\`\`bash
   # Install Stellar CLI
   cargo install --locked stellar-cli
   
   # Configure network
   stellar network add testnet \
     --rpc-url https://soroban-testnet.stellar.org \
     --network-passphrase "Test SDF Network ; September 2015"
   
   # Deploy copy trading contract
   stellar contract deploy \
     --wasm target/wasm32-unknown-unknown/release/copy_trade_contract.wasm \
     --source YOUR_DEPLOYER_SECRET \
     --network testnet
   \`\`\`

2. Save the returned contract ID

**Environment Variables:**
\`\`\`env
NEXT_PUBLIC_COPY_TRADE_CONTRACT_ID=C...CONTRACT_ID_HERE
NEXT_PUBLIC_TRADE_EXECUTION_CONTRACT_ID=C...CONTRACT_ID_HERE
NEXT_PUBLIC_FEE_COLLECTION_CONTRACT_ID=C...CONTRACT_ID_HERE
\`\`\`

### 3. Database (Optional - Required for Production)

#### Supabase (Recommended)
- **What**: PostgreSQL database for user data, trades, and analytics
- **Required**: For production deployment
- **Cost**: Free tier available, paid plans from $25/month

**Setup Steps:**
1. Create account at https://supabase.com
2. Create new project
3. Navigate to Settings > API
4. Copy the following:
   - Project URL
   - `anon` public key
   - `service_role` secret key (for server-side only)

**Environment Variables:**
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJ...YOUR_SERVICE_KEY
\`\`\`

**Database Schema:**
Run the SQL scripts in `scripts/` folder to set up tables:
- `001_create_users_table.sql`
- `002_create_trades_table.sql`
- `003_create_copy_trades_table.sql`
- `004_create_posts_table.sql`

### 4. Admin Configuration

#### Admin Wallet Addresses
- **What**: Stellar addresses authorized to access admin panel
- **Required**: Yes for admin features
- **Security**: Moderate - These are public keys

**Setup Steps:**
1. Add your admin Stellar public key(s)
2. Separate multiple admins with commas

**Environment Variable:**
\`\`\`env
NEXT_PUBLIC_ADMIN_ADDRESSES=GADMIN1...,GADMIN2...,GADMIN3...
\`\`\`

### 5. NextAuth (Optional - For Enhanced Security)

#### NextAuth Secret
- **What**: Encryption secret for session management
- **Required**: For production
- **Security**: CRITICAL

**Setup Steps:**
\`\`\`bash
# Generate a random secret
openssl rand -base64 32
\`\`\`

**Environment Variable:**
\`\`\`env
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://yourdomain.com
\`\`\`

### 6. Analytics and Monitoring (Optional)

#### Vercel Analytics
- **What**: User analytics and performance monitoring
- **Required**: No
- **Cost**: Free on Vercel

**Setup Steps:**
1. Deploy to Vercel
2. Enable Analytics in project settings
3. No environment variables needed (auto-configured)

#### Sentry (Error Tracking)
- **What**: Error monitoring and debugging
- **Required**: Recommended for production
- **Cost**: Free tier available

**Setup Steps:**
1. Create account at https://sentry.io
2. Create new project
3. Copy DSN from project settings

**Environment Variable:**
\`\`\`env
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
\`\`\`

### 7. Email Service (Optional)

#### SendGrid or Resend
- **What**: Send email notifications
- **Required**: For email features
- **Cost**: Free tier available

**Setup Steps (SendGrid):**
1. Create account at https://sendgrid.com
2. Navigate to Settings > API Keys
3. Create new API key with Mail Send permissions

**Environment Variable:**
\`\`\`env
SENDGRID_API_KEY=SG.YOUR_KEY_HERE
EMAIL_FROM=noreply@yourdomain.com
\`\`\`

## Complete .env.local Template

\`\`\`env
# Stellar Network Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_ADMIN_SECRET_KEY=S...YOUR_SECRET_KEY
STELLAR_ADMIN_PUBLIC_KEY=G...YOUR_PUBLIC_KEY

# Soroban Smart Contracts
NEXT_PUBLIC_COPY_TRADE_CONTRACT_ID=C...CONTRACT_ID
NEXT_PUBLIC_TRADE_EXECUTION_CONTRACT_ID=C...CONTRACT_ID
NEXT_PUBLIC_FEE_COLLECTION_CONTRACT_ID=C...CONTRACT_ID

# Admin Configuration
NEXT_PUBLIC_ADMIN_ADDRESSES=G...ADMIN_PUBLIC_KEY

# Database (Production Only)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJ...YOUR_SERVICE_KEY

# Authentication (Production Only)
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=https://yourdomain.com

# Optional Services
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENDGRID_API_KEY=SG.YOUR_KEY
EMAIL_FROM=noreply@yourdomain.com
\`\`\`

## Environment Variable Security Best Practices

### Development (.env.local)
- Never commit to version control
- Add `.env.local` to `.gitignore`
- Share securely with team members (use 1Password, LastPass, etc.)

### Production (Vercel/Hosting)
1. Add environment variables in hosting platform:
   - Vercel: Project Settings > Environment Variables
   - Other: Use your platform's environment variable manager

2. Mark sensitive variables as "Secret" or "Hidden"

3. Use different values for development and production

4. Rotate secrets regularly (every 90 days)

### Critical Security Rules
- ❌ Never expose `STELLAR_ADMIN_SECRET_KEY` to client
- ❌ Never commit secret keys to Git
- ❌ Never log secret keys in console or errors
- ✅ Use `NEXT_PUBLIC_` prefix only for non-sensitive data
- ✅ Store secrets in secure vaults
- ✅ Use environment-specific values

## Testing Your Configuration

After setting up all environment variables:

1. **Test Stellar Connection:**
   \`\`\`bash
   npm run test:stellar
   \`\`\`

2. **Test Smart Contracts:**
   \`\`\`bash
   npm run test:contracts
   \`\`\`

3. **Test Database:**
   \`\`\`bash
   npm run test:db
   \`\`\`

4. **Verify Admin Access:**
   - Connect wallet with admin address
   - Navigate to `/admin`
   - You should see the admin dashboard

## Troubleshooting

### "Stellar connection failed"
- Verify `NEXT_PUBLIC_HORIZON_URL` is correct
- Check network status at status.stellar.org
- Ensure you're using the right network (testnet vs mainnet)

### "Contract not found"
- Verify contract IDs are correct
- Ensure contracts are deployed to the right network
- Check contract is initialized

### "Database connection failed"
- Verify Supabase credentials
- Check project is not paused
- Ensure database tables are created

### "Admin access denied"
- Verify wallet address is in `NEXT_PUBLIC_ADMIN_ADDRESSES`
- Check address format (should start with G)
- Ensure wallet is connected

## Need Help?

- Stellar Documentation: https://developers.stellar.org
- Soroban Documentation: https://soroban.stellar.org
- Community Support: https://discord.gg/stellar

For TradeSocial-specific issues, check:
- GitHub Issues: [your-repo]/issues
- Documentation: README.md and INTEGRATION_GUIDE.md
