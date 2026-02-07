import { useQuery } from '@tanstack/react-query';
import { PortfolioData, IntentAnalytics } from '@/types/analytics';
import { useWalletStore } from '@/store/walletStore';

/**
 * Get user portfolio data
 */
export function usePortfolioData() {
  const { address, network } = useWalletStore();

  return useQuery({
    queryKey: ['portfolio', address, network],
    queryFn: async (): Promise<PortfolioData> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock portfolio data
      return {
        total_value_usd: 0,
        total_value_xlm: 0,
        assets: [],
        change_24h: 0,
        change_7d: 0,
        change_30d: 0,
      };
    },
    enabled: !!address,
  });
}

/**
 * Get intent analytics for the user
 */
export function useIntentAnalytics() {
  const { address } = useWalletStore();

  return useQuery({
    queryKey: ['intent-analytics', address],
    queryFn: async (): Promise<IntentAnalytics> => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        total_intents: 0,
        successful_intents: 0,
        failed_intents: 0,
        pending_intents: 0,
        success_rate: 0,
        total_volume_usd: 0,
        total_gas_spent: '0',
        most_used_action: 'swap',
        avg_execution_time: 0,
      };
    },
    enabled: !!address,
  });
}

/**
 * Get protocol-wide statistics
 */
export function useProtocolStats() {
  return useQuery({
    queryKey: ['protocol-stats'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        total_users: 1234,
        total_intents_executed: 5678,
        total_volume_usd: 1234567,
        total_value_locked: 9876543,
        dex_distribution: [
          { dex: 'Soroswap', volume_usd: 500000, transaction_count: 2500, percentage: 40 },
          { dex: 'Stellar DEX', volume_usd: 375000, transaction_count: 2000, percentage: 30 },
          { dex: 'Aquarius', volume_usd: 250000, transaction_count: 1000, percentage: 20 },
          { dex: 'Phoenix', volume_usd: 125000, transaction_count: 500, percentage: 10 },
        ],
        trending_intents: [],
        last_updated: Date.now(),
      };
    },
    staleTime: 60000, // 1 minute
  });
}
