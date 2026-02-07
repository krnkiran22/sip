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

export interface FreighterAPI {
  isConnected: () => Promise<boolean>;
  getPublicKey: () => Promise<string>;
  signTransaction: (xdr: string, options?: any) => Promise<string>;
  getNetwork: () => Promise<string>;
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
    freighter?: FreighterAPI;
    albedo?: AlbedoAPI;
    rabet?: RabetAPI;
  }
}
