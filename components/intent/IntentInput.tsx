'use client';

import { useState } from 'react';
import { useIntentStore } from '@/store/intentStore';
import { EXAMPLE_INTENTS } from '@/lib/constants';
import { Mic, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function IntentInput() {
  const { draftText, setDraftText, parseIntent, isParsing, parseError } =
    useIntentStore();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftText.trim() || isParsing) return;

    try {
      await parseIntent(draftText);
    } catch (error) {
      console.error('Parse error:', error);
    }
  };

  const handleExampleClick = (example: string) => {
    setDraftText(example);
  };

  return (
    <div className="space-y-4">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div
          className={cn(
            'border-2 rounded-xl transition-all',
            isFocused
              ? 'border-blue-500 shadow-lg'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe what you want to do... (e.g., 'Swap 100 XLM for USDC on Soroswap')"
            className="w-full p-4 text-lg resize-none focus:outline-none rounded-xl"
            rows={4}
          />

          <div className="flex items-center justify-between p-3 border-t bg-gray-50 rounded-b-xl">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Voice input (coming soon)"
              >
                <Mic className="h-5 w-5" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!draftText.trim() || isParsing}
              className={cn(
                'flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium transition-all',
                !draftText.trim() || isParsing
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-700 hover:scale-105'
              )}
            >
              <Sparkles className="h-4 w-4" />
              <span>{isParsing ? 'Parsing...' : 'Parse Intent'}</span>
            </button>
          </div>
        </div>

        {/* Error */}
        {parseError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {parseError}
          </div>
        )}
      </form>

      {/* Example Intents */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-600">
          Try these examples:
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_INTENTS.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
