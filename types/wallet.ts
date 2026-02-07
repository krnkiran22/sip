export type WalletProvider = 'freighter' | 'albedo' | 'rabet' | null;

export type NetworkType = 'mainnet' | 'testnet';

export interface WalletBalance {
  asset_code: string;
  asset_issuer?: string;
  balance: string;
  limit?: string;
  buying_liabilities?: string;
  selling_liabilities?: string;
}

export interface ConnectedWallet {
  address: string;
  provider: WalletProvider;
  network: NetworkType;
  publicKey: string;
}

export interface WalletState {
  address: string | null;
  provider: WalletProvider;
  network: NetworkType;
  balances: WalletBalance[];
  isConnecting: boolean;
  error: string | null;
}

// Freighter API types - matches official @stellar/freighter-api
export interface FreighterAPI {
  isConnected: () => Promise<boolean>;
  getPublicKey: () => Promise<string>;
  getNetwork: () => Promise<string>;
  getNetworkDetails: () => Promise<{
    network: string;
    networkPassphrase: string;
    networkUrl: string;
  }>;
  signTransaction: (
    xdr: string,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ) => Promise<string>;
  signAuthEntry: (
    entryXdr: string,
    opts?: { accountToSign?: string }
  ) => Promise<string>;
}

export interface AlbedoAPI {
  publicKey: (options?: any) => Promise<{ pubkey: string }>;
  tx: (options: any) => Promise<{ signed_envelope_xdr: string }>;
}

export interface RabetAPI {
  connect: () => Promise<{ publicKey: string }>;
  sign: (xdr: string, network: string) => Promise<{ xdr: string }>;
}

declare global {
  interface Window {
    freighterApi?: FreighterAPI;
    albedo?: AlbedoAPI;
    rabet?: RabetAPI;
  }
}
