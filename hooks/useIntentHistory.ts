import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ParsedIntent } from '@/types/intent';
import { useWalletStore } from '@/store/walletStore';

// Mock data for demonstration
const mockIntents: ParsedIntent[] = [];

/**
 * Fetch intent history for the connected user
 */
export function useIntentHistory(filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const { address } = useWalletStore();

  return useQuery({
    queryKey: ['intents', address, filters],
    queryFn: async () => {
      // In production, this would fetch from your backend or directly from Stellar
      // For now, return mock data
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      let intents = [...mockIntents];
      
      if (filters?.status) {
        intents = intents.filter((i) => i.status === filters.status);
      }

      return {
        intents,
        total: intents.length,
        hasMore: false,
      };
    },
    enabled: !!address,
  });
}

/**
 * Fetch a single intent by ID
 */
export function useIntent(intentId: string) {
  return useQuery({
    queryKey: ['intent', intentId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const intent = mockIntents.find((i) => i.intent_id === intentId);
      
      if (!intent) {
        throw new Error('Intent not found');
      }

      return intent;
    },
    enabled: !!intentId,
  });
}

/**
 * Execute an intent
 */
export function useExecuteIntent() {
  const queryClient = useQueryClient();
  const { address } = useWalletStore();

  return useMutation({
    mutationFn: async (intent: ParsedIntent) => {
      // In production, this would:
      // 1. Build the transaction using Stellar SDK
      // 2. Sign it with the wallet
      // 3. Submit to Horizon
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const executedIntent: ParsedIntent = {
        ...intent,
        status: 'completed',
        executed_at: new Date().toISOString(),
        transaction_hash: 'mock_tx_hash_' + Date.now(),
      };

      return executedIntent;
    },
    onSuccess: () => {
      // Invalidate intent history to refetch
      queryClient.invalidateQueries({ queryKey: ['intents', address] });
    },
  });
}

/**
 * Cancel a pending intent
 */
export function useCancelIntent() {
  const queryClient = useQueryClient();
  const { address } = useWalletStore();

  return useMutation({
    mutationFn: async (intentId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Update the mock intent
      const intent = mockIntents.find((i) => i.intent_id === intentId);
      if (intent) {
        intent.status = 'cancelled';
        intent.updated_at = new Date().toISOString();
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intents', address] });
    },
  });
}

/**
 * Subscribe to intent status updates
 */
export function useIntentStatus(intentId: string) {
  return useQuery({
    queryKey: ['intent-status', intentId],
    queryFn: async () => {
      const intent = mockIntents.find((i) => i.intent_id === intentId);
      return intent?.status || 'unknown';
    },
    refetchInterval: 3000, // Poll every 3 seconds
    enabled: !!intentId,
  });
}
