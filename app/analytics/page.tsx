'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsCard } from '@/components/ui/StatsCard';
import { usePortfolioData, useIntentAnalytics, useProtocolStats } from '@/hooks/useAnalytics';
import { useWalletStore } from '@/store/walletStore';
import { TrendingUp, Activity, DollarSign, Zap, PieChart } from 'lucide-react';

export default function AnalyticsPage() {
  const { address } = useWalletStore();
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolioData();
  const { data: analytics, isLoading: analyticsLoading } = useIntentAnalytics();
  const { data: protocolStats, isLoading: protocolLoading } = useProtocolStats();

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600">
              Please connect your wallet to view analytics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analytics
              </h1>
              <p className="text-gray-600">
                Track your portfolio and intent performance
              </p>
            </div>

            {/* Portfolio Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Portfolio Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Value"
                  value={portfolio?.total_value_usd || 0}
                  format="usd"
                  icon={<DollarSign className="h-5 w-5" />}
                  change={portfolio?.change_24h}
                />
                <StatsCard
                  title="24h Change"
                  value={portfolio?.change_24h || 0}
                  format="percent"
                  icon={<TrendingUp className="h-5 w-5" />}
                />
                <StatsCard
                  title="7d Change"
                  value={portfolio?.change_7d || 0}
                  format="percent"
                  icon={<Activity className="h-5 w-5" />}
                />
                <StatsCard
                  title="30d Change"
                  value={portfolio?.change_30d || 0}
                  format="percent"
                  icon={<Zap className="h-5 w-5" />}
                />
              </div>
            </div>

            {/* Intent Analytics */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Intent Performance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Intents"
                  value={analytics?.total_intents || 0}
                  icon={<Zap className="h-5 w-5" />}
                />
                <StatsCard
                  title="Success Rate"
                  value={`${analytics?.success_rate || 0}%`}
                  icon={<TrendingUp className="h-5 w-5" />}
                />
                <StatsCard
                  title="Total Volume"
                  value={analytics?.total_volume_usd || 0}
                  format="usd"
                  icon={<DollarSign className="h-5 w-5" />}
                />
                <StatsCard
                  title="Gas Spent"
                  value={`${analytics?.total_gas_spent || 0} XLM`}
                  icon={<Activity className="h-5 w-5" />}
                />
              </div>
            </div>

            {/* Protocol Stats */}
            {protocolStats && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Protocol Statistics
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {protocolStats.total_users.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {protocolStats.total_intents_executed.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Intents Executed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        ${(protocolStats.total_volume_usd / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-sm text-gray-600">Total Volume</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        ${(protocolStats.total_value_locked / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-sm text-gray-600">TVL</div>
                    </div>
                  </div>

                  {/* DEX Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      DEX Usage Distribution
                    </h3>
                    <div className="space-y-3">
                      {protocolStats.dex_distribution.map((dex) => (
                        <div key={dex.dex}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{dex.dex}</span>
                            <span className="text-gray-600">{dex.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${dex.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
