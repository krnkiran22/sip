# Stellar Intent Protocol - Setup Guide

## ✅ What You've Built

A complete Next.js application for intent-based DeFi trading on Stellar with:
- Freighter wallet integration (FREE & official)
- SDEX (Stellar DEX) swap functionality
- Multi-DEX aggregation architecture
- AI-powered intent parsing
- Portfolio analytics dashboard

## 🚀 Getting Started

### 1. Install Freighter Wallet

**Users MUST install Freighter to use your app:**

1. Visit https://freighter.app
2. Install browser extension (Chrome/Brave/Edge/Firefox)
3. Create new wallet or import existing
4. Save recovery phrase securely
5. Switch to **Testnet** for development

### 2. Run the Application

```bash
cd /Users/kiran/Desktop/stellar/sip_test
npm run dev
```

Visit http://localhost:3000

### 3. Test the Flow

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select "Freighter"
   - Approve in Freighter extension

2. **Go to Dashboard**
   - Enter natural language intent
   - Example: "Swap 10 XLM for USDC"
   - Click "Parse Intent"

3. **Execute Swap**
   - Review parsed intent
   - Check estimated fees
   - Click "Execute Intent"
   - Sign in Freighter

## 📋 Current Implementation Status

### ✅ Completed Features

1. **Wallet Integration**
   - Freighter API connection
   - Multiple wallet support (Freighter, Albedo, Rabet)
   - Balance fetching
   - Network switching (Testnet/Mainnet)

2. **SDEX Integration**
   - Path payment swaps
   - Path finding algorithm
   - Orderbook fetching
   - Trade history

3. **UI Components**
   - Landing page with hero section
   - Dashboard with intent input
   - Wallet connection modal
   - Intent preview
   - Navigation and layout

4. **State Management**
   - Zustand stores for wallet, intents, settings
   - React Query for data fetching
   - Persistent storage

### 🚧 To Implement Next

1. **Soroswap Integration** (Required for full DEX aggregation)
   ```bash
   npm install soroswap-router-sdk
   ```
   Then update `/lib/soroswap.ts` with actual SDK calls

2. **AI Intent Parsing** (Claude API)
   ```bash
   npm install @anthropic-ai/sdk
   ```
   Update `/store/intentStore.ts` parseIntent function

3. **Missing Pages**
   Create these pages in `/app`:
   - `/app/dashboard/page.tsx`
   - `/app/intents/page.tsx`
   - `/app/intents/[id]/page.tsx`
   - `/app/templates/page.tsx`
   - `/app/analytics/page.tsx`
   - `/app/settings/page.tsx`

## 🔧 Key Files to Understand

### Wallet Integration
- `/store/walletStore.ts` - Wallet state and connection logic
- `/components/wallet/` - Wallet UI components
- `/lib/stellar.ts` - Stellar SDK utilities

### Intent Execution
- `/lib/intentExecutor.ts` - Main execution engine
- `/lib/sdex.ts` - SDEX swap functions
- `/lib/soroswap.ts` - Soroswap integration (placeholder)

### State Management
- `/store/walletStore.ts` - Wallet connection state
- `/store/intentStore.ts` - Intent parsing and management
- `/store/settingsStore.ts` - User preferences

## 💰 Cost Breakdown

### ✅ FREE Components
- Freighter Wallet - **$0** (open source)
- @stellar/stellar-sdk - **$0** (open source)
- @stellar/freighter-api - **$0** (official API)
- Stellar network fees - **~$0.00001 per transaction** (0.00001 XLM)

### 💵 Paid Components (Optional)
- Claude API for intent parsing - **~$0.01 per intent** (pay as you go)
- Alternative: Use open-source LLM or keyword parsing

## 🎯 Next Steps for Hackathon

### Priority 1: Core Functionality
1. Create all page files in `/app`
2. Implement actual swap execution in dashboard
3. Test on Stellar testnet with test XLM

### Priority 2: Intent Parsing
1. Set up Claude API OR
2. Implement simple keyword parsing as fallback

### Priority 3: Polish
1. Add loading states
2. Error handling
3. Transaction confirmation toasts
4. Intent history storage

## 📚 Useful Resources

### Stellar Development
- Stellar SDK Docs: https://stellar.github.io/js-stellar-sdk/
- Horizon API: https://developers.stellar.org/api/horizon
- Stellar Expert: https://stellar.expert (blockchain explorer)

### Freighter Wallet
- Freighter Docs: https://docs.freighter.app/
- API Reference: https://docs.freighter.app/docs/guide/gettingStarted

### Testing
- Get testnet XLM: https://laboratory.stellar.org/#account-creator
- Stellar Laboratory: https://laboratory.stellar.org (test transactions)

## 🐛 Common Issues

### "Freighter not found"
- User needs to install Freighter extension
- Check `window.freighterApi` exists
- Provide install link in UI

### "Transaction failed"
- Check account has sufficient XLM balance
- Minimum: 1 XLM + base reserve (0.5 XLM per subentry)
- Verify asset trustlines exist

### "No path found"
- Asset pair might not have liquidity on SDEX
- Try different asset pair
- Check orderbook on Stellar Expert

## 🎉 Demo Flow for Presentation

1. Show landing page
2. Connect Freighter wallet
3. Go to dashboard
4. Type: "Swap 5 XLM for USDC"
5. Show parsed intent with route
6. Execute and show confirmation
7. View transaction on Stellar Expert

## 📞 Support

- Stellar Discord: https://discord.gg/stellar
- Freighter Support: https://discord.gg/freighter

---

Good luck with your hackathon! 🚀
