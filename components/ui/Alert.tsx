'use client';

import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
}

export function Alert({ type, title, message, onClose }: AlertProps) {
  const config = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-600',
    },
  };

  const { bg, border, text, icon: Icon, iconColor } = config[type];

  return (
    <div className={cn('p-4 rounded-lg border flex items-start space-x-3', bg, border)}>
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColor)} />
      <div className={cn('flex-1', text)}>
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn('hover:opacity-70 transition-opacity', text)}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
