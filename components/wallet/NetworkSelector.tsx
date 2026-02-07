'use client';

import { useWalletStore } from '@/store/walletStore';
import { NetworkType } from '@/types/wallet';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NetworkSelector() {
  const { network, switchNetwork } = useWalletStore();

  const networks: { value: NetworkType; label: string; color: string }[] = [
    { value: 'testnet', label: 'Testnet', color: 'bg-yellow-500' },
    { value: 'mainnet', label: 'Mainnet', color: 'bg-green-500' },
  ];

  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
      <Globe className="h-4 w-4 text-gray-600" />
      <select
        value={network}
        onChange={(e) => switchNetwork(e.target.value as NetworkType)}
        className="bg-transparent text-sm font-medium text-gray-900 focus:outline-none cursor-pointer"
      >
        {networks.map((net) => (
          <option key={net.value} value={net.value}>
            {net.label}
          </option>
        ))}
      </select>
      <div
        className={cn('w-2 h-2 rounded-full', networks.find((n) => n.value === network)?.color)}
      />
    </div>
  );
}
