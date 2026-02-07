import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WalletProvider, NetworkType, WalletBalance } from '@/types/wallet';
import * as StellarSdk from '@stellar/stellar-sdk';

interface WalletState {
  // State
  address: string | null;
  provider: WalletProvider;
  network: NetworkType;
  balances: WalletBalance[];
  isConnecting: boolean;
  error: string | null;
  
  // Actions
  connect: (provider: WalletProvider) => Promise<void>;
  disconnect: () => void;
  switchNetwork: (network: NetworkType) => void;
  fetchBalances: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      address: null,
      provider: null,
      network: 'testnet',
      balances: [],
      isConnecting: false,
      error: null,

      // Connect wallet
      connect: async (provider: WalletProvider) => {
        set({ isConnecting: true, error: null });
        
        try {
          let publicKey: string | null = null;

          if (provider === 'freighter') {
            if (!window.freighter) {
              throw new Error('Freighter wallet not installed');
            }
            publicKey = await window.freighter.getPublicKey();
          } else if (provider === 'albedo') {
            if (!window.albedo) {
              throw new Error('Albedo wallet not installed');
            }
            const result = await window.albedo.publicKey();
            publicKey = result.pubkey;
          } else if (provider === 'rabet') {
            if (!window.rabet) {
              throw new Error('Rabet wallet not installed');
            }
            const result = await window.rabet.connect();
            publicKey = result.publicKey;
          }

          if (publicKey) {
            set({ 
              address: publicKey, 
              provider, 
              isConnecting: false 
            });
            // Fetch balances after connecting
            await get().fetchBalances();
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to connect wallet', 
            isConnecting: false 
          });
          throw error;
        }
      },

      // Disconnect wallet
      disconnect: () => {
        set({ 
          address: null, 
          provider: null, 
          balances: [], 
          error: null 
        });
      },

      // Switch network
      switchNetwork: (network: NetworkType) => {
        set({ network, balances: [] });
        // Refetch balances for new network
        if (get().address) {
          get().fetchBalances();
        }
      },

      // Fetch balances
      fetchBalances: async () => {
        const { address, network } = get();
        if (!address) return;

        try {
          const server = new StellarSdk.Horizon.Server(
            network === 'mainnet' 
              ? 'https://horizon.stellar.org'
              : 'https://horizon-testnet.stellar.org'
          );

          const account = await server.loadAccount(address);
          const balances: WalletBalance[] = account.balances.map((balance: any) => ({
            asset_code: balance.asset_type === 'native' ? 'XLM' : balance.asset_code,
            asset_issuer: balance.asset_issuer,
            balance: balance.balance,
            limit: balance.limit,
            buying_liabilities: balance.buying_liabilities,
            selling_liabilities: balance.selling_liabilities,
          }));

          set({ balances });
        } catch (error: any) {
          console.error('Error fetching balances:', error);
          set({ error: 'Failed to fetch balances' });
        }
      },

      // Set error
      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        address: state.address,
        provider: state.provider,
        network: state.network,
      }),
    }
  )
);
