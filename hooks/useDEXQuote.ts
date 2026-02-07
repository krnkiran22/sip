import { useQuery } from '@tanstack/react-query';
import { SwapQuote, TokenInfo } from '@/types/dex';
import { useWalletStore } from '@/store/walletStore';

/**
 * Get swap quotes from multiple DEXs
 */
export function useDEXQuote(
  fromToken: string,
  toToken: string,
  amount: string,
  enabled: boolean = true
) {
  const { network } = useWalletStore();

  return useQuery({
    queryKey: ['dex-quote', fromToken, toToken, amount, network],
    queryFn: async (): Promise<SwapQuote[]> => {
      // In production, this would query multiple DEX contracts
      // For now, return mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockQuote: SwapQuote = {
        dex: 'soroswap',
        from_token: {
          code: fromToken,
          name: fromToken,
          decimals: 7,
        },
        to_token: {
          code: toToken,
          name: toToken,
          decimals: 7,
        },
        amount_in: amount,
        amount_out: (parseFloat(amount) * 0.95).toString(),
        price_impact: 0.5,
        estimated_gas: '100000',
        route: [],
        valid_until: Date.now() + 30000,
      };

      return [mockQuote];
    },
    enabled: enabled && !!fromToken && !!toToken && !!amount,
    staleTime: 10000, // 10 seconds
  });
}

/**
 * Get optimal route for a swap
 */
export function useOptimalRoute(
  fromToken: string,
  toToken: string,
  amount: string
) {
  const { network } = useWalletStore();

  return useQuery({
    queryKey: ['optimal-route', fromToken, toToken, amount, network],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        route: [
          {
            dex: 'soroswap' as const,
            from_token: fromToken,
            to_token: toToken,
            amount_in: amount,
            amount_out: (parseFloat(amount) * 0.95).toString(),
          },
        ],
        total_output: (parseFloat(amount) * 0.95).toString(),
        price_impact: 0.5,
      };
    },
    enabled: !!fromToken && !!toToken && !!amount,
  });
}

/**
 * Get supported tokens list
 */
export function useSupportedTokens() {
  const { network } = useWalletStore();

  return useQuery({
    queryKey: ['supported-tokens', network],
    queryFn: async (): Promise<TokenInfo[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Return mock tokens
      return [
        {
          code: 'XLM',
          name: 'Stellar Lumens',
          decimals: 7,
        },
        {
          code: 'USDC',
          issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
          name: 'USD Coin',
          decimals: 7,
        },
        {
          code: 'AQUA',
          issuer: 'GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA',
          name: 'Aquarius',
          decimals: 7,
        },
      ];
    },
  });
}
