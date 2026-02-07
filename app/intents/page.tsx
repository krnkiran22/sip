'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { IntentCard } from '@/components/intent/IntentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingCard } from '@/components/ui/LoadingStates';
import { useIntentHistory } from '@/hooks/useIntentHistory';
import { useWalletStore } from '@/store/walletStore';
import { IntentStatus } from '@/types/intent';
import { Search, Filter, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IntentsPage() {
  const { address } = useWalletStore();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'history'>('all');
  const [statusFilter, setStatusFilter] = useState<IntentStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useIntentHistory({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const tabs = [
    { id: 'all' as const, label: 'All Intents', count: data?.total || 0 },
    { id: 'active' as const, label: 'Active', count: 0 },
    { id: 'history' as const, label: 'History', count: 0 },
  ];

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <EmptyState
            icon={<FileText className="h-8 w-8 text-gray-400" />}
            title="Connect Your Wallet"
            description="Please connect your wallet to view your intents."
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
                Your Intents
              </h1>
              <p className="text-gray-600">
                View and manage all your intents
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl p-1 shadow-sm mb-6 inline-flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-6 py-2 rounded-lg font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 text-sm">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search intents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="executing">Executing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Intents List */}
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                </>
              ) : data && data.intents.length > 0 ? (
                data.intents.map((intent) => (
                  <IntentCard key={intent.intent_id} intent={intent} />
                ))
              ) : (
                <EmptyState
                  icon={<FileText className="h-8 w-8 text-gray-400" />}
                  title="No Intents Found"
                  description="You haven't created any intents yet. Start by creating your first intent on the dashboard."
                  action={{
                    label: 'Go to Dashboard',
                    onClick: () => (window.location.href = '/dashboard'),
                  }}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
