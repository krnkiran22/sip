'use client';

import { useState } from 'react';
import { useWalletStore } from '@/store/walletStore';
import { formatAddress } from '@/lib/formatting';
import { WalletConnectModal } from './WalletConnectModal';
import { WalletDropdown } from './WalletDropdown';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WalletButton() {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { address, isConnecting } = useWalletStore();

  if (address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
        >
          <Wallet className="h-4 w-4" />
          <span>{formatAddress(address)}</span>
        </button>
        {showDropdown && (
          <WalletDropdown onClose={() => setShowDropdown(false)} />
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isConnecting}
        className={cn(
          'flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors',
          isConnecting && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Wallet className="h-4 w-4" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>

      {showModal && (
        <WalletConnectModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
