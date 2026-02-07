'use client';

import { useIntentStore } from '@/store/intentStore';
import { useSettingsStore } from '@/store/settingsStore';
import { IntentStatusBadge } from './IntentStatusBadge';
import { formatAmount, formatGasFee } from '@/lib/formatting';
import { AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function IntentPreview() {
  const { currentIntent } = useIntentStore();
  const { intent_preferences } = useSettingsStore();

  if (!currentIntent) {
    return (
      <div className="border-2 border-dashed rounded-xl p-12 text-center">
        <div className="text-gray-400 mb-2">
          <Info className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-gray-600">
          Enter a natural language intent to see the preview
        </p>
      </div>
    );
  }

  const operation = currentIntent.parsed_intent.operations[0];
  const hasHighSlippage =
    (currentIntent.slippage_tolerance || intent_preferences.default_slippage_tolerance) > 2;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Intent Preview</h3>
        <IntentStatusBadge status={currentIntent.status} size="md" />
      </div>

      {/* Original Text */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-xs font-medium text-blue-700 mb-1">
          Original Intent
        </div>
        <p className="text-sm text-gray-900">{currentIntent.raw_text}</p>
      </div>

      {/* Parsed Operations */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">
          Parsed Operations
        </div>

        {currentIntent.parsed_intent.operations.map((op, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-white space-y-3"
          >
            {op.type === 'swap' && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatAmount(op.amount || '0', 2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {op.from_asset}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {currentIntent.expected_output || '~'}
                      </div>
                      <div className="text-xs text-gray-500">{op.to_asset}</div>
                    </div>
                  </div>
                </div>

                {op.protocol && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Protocol:</span> {op.protocol}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Conditions */}
      {currentIntent.parsed_intent.conditions &&
        currentIntent.parsed_intent.conditions.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm font-medium text-yellow-900 mb-2">
              Conditions
            </div>
            <ul className="space-y-1 text-sm text-yellow-800">
              {currentIntent.parsed_intent.conditions.map((condition, index) => (
                <li key={index}>
                  • {condition.type.replace(/_/g, ' ')}:{' '}
                  {condition.value.toString()}
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Transaction Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Estimated Gas Fee</span>
          <span className="font-medium text-gray-900">
            {currentIntent.estimated_gas
              ? formatGasFee(currentIntent.estimated_gas)
              : '~0.00001 XLM'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Slippage Tolerance</span>
          <span className="font-medium text-gray-900">
            {currentIntent.slippage_tolerance ||
              intent_preferences.default_slippage_tolerance}
            %
          </span>
        </div>
      </div>

      {/* Warnings */}
      {hasHighSlippage && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-orange-800">
            <div className="font-medium mb-1">High Slippage Warning</div>
            <p>
              Your slippage tolerance is set high. You may receive significantly
              less than expected.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Execute Intent
        </button>
        <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
