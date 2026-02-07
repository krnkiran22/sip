'use client';

import { DEXProtocol } from '@/types/dex';
import { DEX_CONFIGS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ProtocolBadgeProps {
  protocol: DEXProtocol;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function ProtocolBadge({
  protocol,
  size = 'md',
  showName = true,
}: ProtocolBadgeProps) {
  const config = DEX_CONFIGS.find((dex) => dex.protocol === protocol);
  
  if (!config) return null;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center space-x-2 bg-gray-100 rounded-lg font-medium text-gray-900',
        sizeClasses[size]
      )}
    >
      <div className="text-lg">{config.logo}</div>
      {showName && <span>{config.name}</span>}
    </div>
  );
}
