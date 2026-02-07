'use client';

import { useWalletStore } from '@/store/walletStore';
import { WalletProvider } from '@/types/wallet';
import { X } from 'lucide-react';

interface WalletConnectModalProps {
  onClose: () => void;
}

const walletProviders: Array<{
  id: WalletProvider;
  name: string;
  description: string;
  logo: string;
}> = [
  {
    id: 'freighter',
    name: 'Freighter',
    description: 'The most popular Stellar wallet',
    logo: '🚀',
  },
  {
    id: 'albedo',
    name: 'Albedo',
    description: 'Secure web wallet for Stellar',
    logo: '🌟',
  },
  {
    id: 'rabet',
    name: 'Rabet',
    description: 'Browser extension wallet',
    logo: '🐰',
  },
];

export function WalletConnectModal({ onClose }: WalletConnectModalProps) {
  const { connect, error } = useWalletStore();

  const handleConnect = async (provider: WalletProvider) => {
    try {
      await connect(provider);
      onClose();
    } catch (error) {
      // Error is handled in store
      console.error('Failed to connect:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {walletProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleConnect(provider.id)}
              className="w-full flex items-center space-x-4 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="text-3xl">{provider.logo}</div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                  {provider.name}
                </div>
                <div className="text-sm text-gray-600">
                  {provider.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-xl">
          <p className="text-sm text-gray-600 text-center">
            By connecting a wallet, you agree to the{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
