'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { IntentInput } from '@/components/intent/IntentInput';
import { IntentPreview } from '@/components/intent/IntentPreview';
import { StatsCard } from '@/components/ui/StatsCard';
import { useWalletStore } from '@/store/walletStore';
import { useIntentAnalytics } from '@/hooks/useAnalytics';
import { Zap, TrendingUp, Activity, Clock } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';

export default function DashboardPage() {
  const { address } = useWalletStore();
  const { data: analytics, isLoading } = useIntentAnalytics();

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Alert
            type="info"
            title="Connect Your Wallet"
            message="Please connect your wallet to start creating intents."
          />
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
                Dashboard
              </h1>
              <p className="text-gray-600">
                Create and manage your intents with natural language
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Intents"
                value={analytics?.total_intents || 0}
                icon={<Zap className="h-5 w-5" />}
              />
              <StatsCard
                title="Success Rate"
                value={`${analytics?.success_rate || 0}%`}
                icon={<TrendingUp className="h-5 w-5" />}
                change={5.2}
              />
              <StatsCard
                title="Active Intents"
                value={analytics?.pending_intents || 0}
                icon={<Activity className="h-5 w-5" />}
              />
              <StatsCard
                title="Total Volume"
                value={analytics?.total_volume_usd || 0}
                format="usd"
                icon={<Clock className="h-5 w-5" />}
              />
            </div>

            {/* Main Content - 2 Columns */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Intent Input */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Create New Intent
                </h2>
                <IntentInput />
              </div>

              {/* Right Column - Intent Preview */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <IntentPreview />
              </div>
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
