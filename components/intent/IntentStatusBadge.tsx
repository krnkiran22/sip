'use client';

import { IntentStatus } from '@/types/intent';
import { INTENT_STATUS_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, Loader, XCircle, Ban, FileEdit } from 'lucide-react';

interface IntentStatusBadgeProps {
  status: IntentStatus;
  size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
  FileEdit,
  Clock,
  Loader,
  CheckCircle,
  XCircle,
  Ban,
};

export function IntentStatusBadge({ status, size = 'sm' }: IntentStatusBadgeProps) {
  const config = INTENT_STATUS_CONFIG[status];
  const Icon = iconMap[config.icon as keyof typeof iconMap];

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center space-x-1.5 rounded-full font-medium text-white',
        config.color,
        sizeClasses[size]
      )}
    >
      <Icon className={cn(iconSizes[size], status === 'executing' && 'animate-spin')} />
      <span>{config.label}</span>
    </div>
  );
}
