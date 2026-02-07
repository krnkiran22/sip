This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Stellar Intent Protocol (SIP)

AI-powered DeFi platform that converts natural language commands into blockchain transactions on Stellar.

## 🌟 Features

- **Natural Language Interface**: Describe what you want to do in plain English
- **Multi-DEX Aggregation**: Automatically routes through SDEX and Soroswap for best prices
- **Freighter Wallet Integration**: Secure, non-custodial wallet connection
- **Real-time Intent Parsing**: AI-powered intent understanding
- **Portfolio Analytics**: Track your performance and history

## 🚀 Quick Start

### Prerequisites

1. **Install Freighter Wallet** (FREE & Required)
   - Visit [freighter.app](https://freighter.app)
   - Install browser extension for Chrome, Brave, Edge, or Firefox
   - Create or import a Stellar account

2. **Node.js** v18+ and npm installed

### Installation

```bash
# Clone the repository
git clone https://github.com/krnkiran22/sip.git
cd sip

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query (TanStack Query)

### Blockchain Integration
- **Wallet**: Freighter API (`@stellar/freighter-api`)
- **Stellar SDK**: `@stellar/stellar-sdk`
- **SDEX**: Native Stellar DEX integration
- **Soroswap**: AMM DEX on Soroban (coming soon)

### AI
- **Intent Parsing**: Claude API (Anthropic)

## 📁 Project Structure

```
sip_test/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard
│   ├── intents/           # Intent management
│   ├── templates/         # Intent templates
│   ├── analytics/         # User analytics
│   └── settings/          # User settings
├── components/
│   ├── layout/            # Navbar, Sidebar, Footer
│   ├── wallet/            # Wallet connection components
│   ├── intent/            # Intent-related components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── stellar.ts         # Stellar SDK utilities
│   ├── sdex.ts            # SDEX integration
│   ├── soroswap.ts        # Soroswap integration
│   ├── intentExecutor.ts  # Main execution logic
│   ├── formatting.ts      # Formatting utilities
│   └── constants.ts       # App constants
├── store/
│   ├── walletStore.ts     # Wallet state management
│   ├── intentStore.ts     # Intent state management
│   └── settingsStore.ts   # User settings
├── types/                 # TypeScript type definitions
└── hooks/                 # React Query hooks
```

## 💡 Usage

### 1. Connect Wallet
Click "Connect Wallet" in the navbar and select Freighter. Approve the connection in the Freighter extension.

### 2. Create an Intent
Go to Dashboard and type a natural language command:
- "Swap 100 XLM for USDC"
- "Buy 50 USDC worth of AQUA on Soroswap"
- "Send 100 XLM to GABC..."

### 3. Review and Execute
The AI will parse your intent, find the best route, and show you:
- Parsed operations
- Estimated gas fees
- Expected output
- Price impact

Click "Execute Intent" and approve in Freighter.

## 🔐 Security

- **Non-Custodial**: You always control your private keys via Freighter
- **No Backend**: Direct interaction with Stellar network
- **Open Source**: All code is auditable

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

### Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_api_key
```

## 📋 Roadmap

### Phase 1 (MVP - Complete)
- ✅ Landing page
- ✅ Dashboard with intent input
- ✅ Wallet connection (Freighter)
- ✅ Basic SDEX swaps
- ✅ Intent history

### Phase 2 (In Progress)
- 🚧 Full Soroswap integration
- 🚧 Intent templates library
- 🚧 Advanced analytics
- 🚧 Conditional intents
- 🚧 DCA (Dollar Cost Averaging)

### Phase 3 (Planned)
- ⏳ Solver marketplace
- ⏳ Cross-chain bridging
- ⏳ Yield optimization
- ⏳ Mobile app

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **Website**: [Coming Soon]
- **Twitter**: [@StellarIntent]
- **Discord**: [Join our community]
- **Documentation**: [docs.stellarintent.com]

## 💬 Support

For support, email support@stellarintent.com or join our Discord.

---

Built with ❤️ for the Stellar ecosystem

