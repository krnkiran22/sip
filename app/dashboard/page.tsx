'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SwapInterface } from '@/components/swap/SwapInterface';
import { StatsGrid } from '@/components/ui/StatsGrid';
import { useWalletStore } from '@/store/walletStore';
import { Alert } from '@/components/ui/Alert';

export default function DashboardPage() {
  const { address } = useWalletStore();

  if (!address) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Alert
            type="info"
            title="Connect Your Wallet"
            message="Please connect your Freighter wallet to start trading."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 border-l border-white/10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Command Center
                </h1>
              </div>
              <p className="text-white/40 text-sm tracking-wide">
                Execute intent-based swaps with AI-powered routing
              </p>
            </div>

            {/* Stats Grid */}
            <StatsGrid />

            {/* Swap Interface */}
            <div className="mb-8">
              <SwapInterface />
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="text-center py-12 text-gray-500">
                No recent activity. Create your first intent above!
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
