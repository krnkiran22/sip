import { create } from 'zustand';
import { ParsedIntent } from '@/types/intent';

interface IntentState {
  // Current intent being drafted/edited
  currentIntent: ParsedIntent | null;
  draftText: string;
  isParsing: boolean;
  parseError: string | null;
  
  // Actions
  setDraftText: (text: string) => void;
  parseIntent: (text: string) => Promise<void>;
  setCurrentIntent: (intent: ParsedIntent | null) => void;
  clearIntent: () => void;
  updateIntentStatus: (intentId: string, status: ParsedIntent['status']) => void;
}

export const useIntentStore = create<IntentState>()((set, get) => ({
  // Initial state
  currentIntent: null,
  draftText: '',
  isParsing: false,
  parseError: null,

  // Set draft text
  setDraftText: (text: string) => {
    set({ draftText: text, parseError: null });
  },

  // Parse intent from natural language
  parseIntent: async (text: string) => {
    set({ isParsing: true, parseError: null });
    
    try {
      // This would call Claude API or a parsing service
      // For now, we'll create a mock implementation
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock parsing logic - in production, this would call Claude API
      const parsedIntent: ParsedIntent = {
        intent_id: `intent_${Date.now()}`,
        user_address: '', // Will be filled from wallet
        raw_text: text,
        parsed_intent: {
          action: 'swap', // Parse from text
          operations: [{
            type: 'swap',
            protocol: 'soroswap',
            from_asset: 'XLM',
            to_asset: 'USDC',
            amount: '100',
          }],
        },
        status: 'draft',
        created_at: new Date().toISOString(),
      };

      set({ 
        currentIntent: parsedIntent, 
        isParsing: false 
      });
    } catch (error: any) {
      set({ 
        parseError: error.message || 'Failed to parse intent', 
        isParsing: false 
      });
      throw error;
    }
  },

  // Set current intent
  setCurrentIntent: (intent: ParsedIntent | null) => {
    set({ currentIntent: intent });
  },

  // Clear current intent
  clearIntent: () => {
    set({ 
      currentIntent: null, 
      draftText: '', 
      parseError: null 
    });
  },

  // Update intent status
  updateIntentStatus: (intentId: string, status: ParsedIntent['status']) => {
    const { currentIntent } = get();
    if (currentIntent && currentIntent.intent_id === intentId) {
      set({
        currentIntent: {
          ...currentIntent,
          status,
          updated_at: new Date().toISOString(),
        },
      });
    }
  },
}));
