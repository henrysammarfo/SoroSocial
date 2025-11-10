# Security Guidelines

## Environment Variables

### Critical Security Rules:

1. **NEVER commit `.env.local` to git**
   - Add `.env.local` to `.gitignore`
   - Use `.env.local.example` as template only

2. **Generate Secure Keys**
   \`\`\`bash
   # Generate secure random keys using OpenSSL
   openssl rand -base64 32
   \`\`\`

3. **Rotate Keys Regularly**
   - Change JWT_SECRET, API_SECRET_KEY every 90 days
   - Update admin addresses when personnel changes

4. **Admin Addresses**
   - Store admin wallet addresses in environment variables only
   - Never hardcode admin addresses in source code
   - Use role-based access control (RBAC)

## Smart Contract Security

### Contract Deployment:
1. Deploy contracts to Stellar testnet first
2. Audit all contract code before mainnet deployment
3. Use timelock for critical operations
4. Implement emergency pause functionality

### Access Control:
- Admin functions must verify caller address on-chain
- Use multi-signature for critical operations
- Implement rate limiting for user actions

## API Security

### Rate Limiting:
\`\`\`typescript
// Implement in middleware.ts
const rateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
\`\`\`

### Input Validation:
- Validate all user inputs
- Sanitize data before storing
- Use TypeScript for type safety

### Authentication:
- Verify wallet signatures for all authenticated requests
- Implement session management
- Use HTTPS in production

## Content Moderation

### Reporting System:
- All reports reviewed by admins only
- Automated spam detection
- User reputation scoring

### Admin Actions:
- All admin actions logged
- Require confirmation for destructive operations
- Audit trail for compliance

## Production Checklist

Before deploying to production:

- [ ] All environment variables set
- [ ] Smart contracts audited
- [ ] Rate limiting enabled
- [ ] HTTPS configured
- [ ] Admin addresses configured
- [ ] Backup and recovery plan
- [ ] Monitoring and alerts set up
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
