'use client';

import { useEffect, useRef } from 'react';
import { useWalletStore } from '@/store/walletStore';
import { useSettingsStore } from '@/store/settingsStore';
import { formatAddress, copyToClipboard, getExplorerUrl } from '@/lib/formatting';
import { Copy, ExternalLink, LogOut } from 'lucide-react';

interface WalletDropdownProps {
  onClose: () => void;
}

export function WalletDropdown({ onClose }: WalletDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { address, network, disconnect } = useWalletStore();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!address) return null;

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(address);
    if (success) {
      // Show toast notification
      console.log('Address copied!');
    }
  };

  const handleViewExplorer = () => {
    const url = getExplorerUrl(address, network, 'account');
    window.open(url, '_blank');
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50"
    >
      {/* Address */}
      <div className="px-4 py-3 border-b">
        <div className="text-sm text-gray-500 mb-1">Connected Address</div>
        <div className="text-sm font-mono">{formatAddress(address, 8)}</div>
      </div>

      {/* Actions */}
      <div className="py-1">
        <button
          onClick={handleCopyAddress}
          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Copy className="h-4 w-4" />
          <span>Copy Address</span>
        </button>

        <button
          onClick={handleViewExplorer}
          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View in Explorer</span>
        </button>
      </div>

      {/* Disconnect */}
      <div className="border-t py-1">
        <button
          onClick={handleDisconnect}
          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Disconnect</span>
        </button>
      </div>
    </div>
  );
}
