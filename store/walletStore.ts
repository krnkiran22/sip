import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WalletProvider, NetworkType, WalletBalance } from '@/types/wallet';
import * as StellarSdk from '@stellar/stellar-sdk';
import { isConnected, requestAccess, getAddress, getNetwork, signTransaction as freighterSignTransaction } from '@stellar/freighter-api';

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
            // Check if Freighter is installed using official API
            const connectionCheck = await isConnected();
            
            if (!connectionCheck.isConnected) {
              throw new Error('Freighter wallet not found. Please install the Freighter browser extension from freighter.app and refresh the page.');
            }
            
            console.log('✅ Freighter detected!');
            
            try {
              // Request access (this triggers the Freighter popup)
              const accessResult = await requestAccess();
              
              if (accessResult.error) {
                throw new Error(accessResult.error);
              }
              
              if (accessResult.address) {
                publicKey = accessResult.address;
                console.log('✅ Freighter connected:', publicKey.slice(0, 4) + '...' + publicKey.slice(-4));
              }
            } catch (err: any) {
              if (err.message?.includes('User declined access') || err.message?.includes('User rejected')) {
                throw new Error('Connection rejected. Please approve the connection in Freighter.');
              }
              throw err;
            }
            
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

      // Sign transaction
      signTransaction: async (transactionXDR: string) => {
        const { provider, network } = get();
        
        if (!provider) {
          throw new Error('No wallet connected');
        }

        try {
          let signedXDR: string;

          if (provider === 'freighter') {
            const networkName = network === 'testnet' ? 'TESTNET' : 'PUBLIC';
            const result = await freighterSignTransaction(transactionXDR, {
              network: networkName,
            });
            
            if (result.error) {
              throw new Error(result.error);
            }
            
            signedXDR = result.signedTxXdr;
          } else if (provider === 'albedo') {
            if (!window.albedo) {
              throw new Error('Albedo wallet not available');
            }
            const result = await window.albedo.tx({ xdr: transactionXDR });
            signedXDR = result.signed_envelope_xdr;
          } else if (provider === 'rabet') {
            if (!window.rabet) {
              throw new Error('Rabet wallet not available');
            }
            const result = await window.rabet.sign(transactionXDR);
            signedXDR = result.xdr;
          } else {
            throw new Error('Unsupported wallet provider');
          }

          return signedXDR;
        } catch (error: any) {
          throw new Error(`Failed to sign transaction: ${error.message}`);
        }
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
