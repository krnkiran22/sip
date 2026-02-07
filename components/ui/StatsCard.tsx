'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber, formatPercent, formatUSD } from '@/lib/formatting';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  format?: 'number' | 'usd' | 'percent';
  trend?: 'up' | 'down';
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  format = 'number',
  trend,
}: StatsCardProps) {
  const formattedValue =
    typeof value === 'number'
      ? format === 'usd'
        ? formatUSD(value)
        : format === 'percent'
        ? formatPercent(value, 2)
        : formatNumber(value)
      : value;

  const isPositive = change !== undefined && change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">{formattedValue}</div>

        {change !== undefined && (
          <div
            className={cn(
              'flex items-center space-x-1 text-sm font-medium',
              isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            <TrendIcon className="h-4 w-4" />
            <span>
              {Math.abs(change).toFixed(2)}% {isPositive ? 'increase' : 'decrease'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
