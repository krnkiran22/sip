'use client';

import { ParsedIntent } from '@/types/intent';
import { IntentStatusBadge } from './IntentStatusBadge';
import { formatDateRelative, formatAmount, formatUSD } from '@/lib/formatting';
import { ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface IntentCardProps {
  intent: ParsedIntent;
  onClick?: () => void;
}

export function IntentCard({ intent, onClick }: IntentCardProps) {
  const operation = intent.parsed_intent.operations[0];
  
  return (
    <div
      onClick={onClick}
      className="border rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer bg-white"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <IntentStatusBadge status={intent.status} />
            <span className="text-xs text-gray-500">
              {formatDateRelative(intent.created_at)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {intent.raw_text}
          </h3>
        </div>
      </div>

      {/* Operation Details */}
      {operation && (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-3">
          {operation.type === 'swap' && (
            <>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">
                  {formatAmount(operation.amount || '0', 2)}
                </div>
                <div className="text-xs text-gray-500">{operation.from_asset}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">
                  {intent.expected_output || '~'}
                </div>
                <div className="text-xs text-gray-500">{operation.to_asset}</div>
              </div>
              {operation.protocol && (
                <div className="ml-auto text-xs text-gray-500">
                  via {operation.protocol}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-gray-600">
          {intent.estimated_gas && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>~{intent.estimated_gas} XLM</span>
            </div>
          )}
        </div>

        {intent.status === 'completed' && intent.transaction_hash && (
          <Link
            href={`/intents/${intent.intent_id}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            View Details →
          </Link>
        )}

        {intent.status === 'failed' && (
          <span className="text-red-600 text-xs">
            {intent.error_message || 'Failed'}
          </span>
        )}
      </div>
    </div>
  );
}
