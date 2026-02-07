'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSettingsStore } from '@/store/settingsStore';
import { useWalletStore } from '@/store/walletStore';
import { cn } from '@/lib/utils';
import { Save, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const settings = useSettingsStore();
  const { disconnect } = useWalletStore();
  const [activeTab, setActiveTab] = useState<'wallet' | 'intent' | 'security' | 'notifications'>('wallet');

  const tabs = [
    { id: 'wallet' as const, label: 'Wallet' },
    { id: 'intent' as const, label: 'Intent Preferences' },
    { id: 'security' as const, label: 'Security' },
    { id: 'notifications' as const, label: 'Notifications' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Settings
              </h1>
              <p className="text-gray-600">
                Manage your preferences and security settings
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
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              {activeTab === 'wallet' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Network
                    </label>
                    <select
                      value={settings.wallet_preferences.default_network}
                      onChange={(e) =>
                        settings.updateWalletPreferences({
                          default_network: e.target.value as 'mainnet' | 'testnet',
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="testnet">Testnet</option>
                      <option value="mainnet">Mainnet</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Auto Connect</div>
                      <div className="text-sm text-gray-600">
                        Automatically connect wallet on page load
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.wallet_preferences.auto_connect}
                      onChange={(e) =>
                        settings.updateWalletPreferences({
                          auto_connect: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="pt-6 border-t">
                    <button
                      onClick={disconnect}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'intent' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Slippage Tolerance (%)
                    </label>
                    <input
                      type="number"
                      value={settings.intent_preferences.default_slippage_tolerance}
                      onChange={(e) =>
                        settings.updateIntentPreferences({
                          default_slippage_tolerance: parseFloat(e.target.value),
                        })
                      }
                      step="0.1"
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Gas Fee (stroops)
                    </label>
                    <input
                      type="text"
                      value={settings.intent_preferences.max_gas_fee}
                      onChange={(e) =>
                        settings.updateIntentPreferences({
                          max_gas_fee: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Auto-Approve Trusted Intents</div>
                      <div className="text-sm text-gray-600">
                        Skip confirmation for trusted intent types
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.intent_preferences.auto_approve_trusted}
                      onChange={(e) =>
                        settings.updateIntentPreferences({
                          auto_approve_trusted: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.security.session_timeout_minutes}
                      onChange={(e) =>
                        settings.updateSecurity({
                          session_timeout_minutes: parseInt(e.target.value),
                        })
                      }
                      min="5"
                      max="1440"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Spending Limit (optional)
                    </label>
                    <input
                      type="text"
                      value={settings.security.spending_limit_daily || ''}
                      onChange={(e) =>
                        settings.updateSecurity({
                          spending_limit_daily: e.target.value || undefined,
                        })
                      }
                      placeholder="No limit"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          settings.updateNotifications({
                            [key]: e.target.checked,
                          })
                        }
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t flex justify-end space-x-4">
                <button
                  onClick={() => settings.resetToDefaults()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Reset to Defaults
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
