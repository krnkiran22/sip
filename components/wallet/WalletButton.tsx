'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/store/walletStore';
import { formatAddress } from '@/lib/formatting';
import { WalletConnectModal } from './WalletConnectModal';
import { WalletDropdown } from './WalletDropdown';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isConnected, getAddress } from '@stellar/freighter-api';

export function WalletButton() {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [freighterInstalled, setFreighterInstalled] = useState(false);
  const { address, isConnecting } = useWalletStore();

  // Check for Freighter using official API
  useEffect(() => {
    const checkFreighter = async () => {
      try {
        const result = await isConnected();
        
        if (result.isConnected) {
          console.log('✅ Freighter detected!');
          setFreighterInstalled(true);
          
          // Try to get existing connection
          const addressResult = await getAddress();
          if (addressResult.address) {
            console.log('Already connected:', addressResult.address);
          }
        } else {
          console.log('⚠️ Freighter not detected');
          setFreighterInstalled(false);
        }
      } catch (error) {
        console.error('Error checking Freighter:', error);
        setFreighterInstalled(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Add small delay to ensure extension loads
    setTimeout(checkFreighter, 500);
  }, []);

  if (address) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isConnecting || isChecking}
        className={cn(
          "flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors",
          (isConnecting || isChecking) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        )}
      >
        <Wallet className="h-4 w-4" />
        <span>{isChecking ? 'Checking...' : isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>

      {showModal && (
        <WalletConnectModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
