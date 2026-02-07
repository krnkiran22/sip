export type OracleProvider = 'dia' | 'reflector' | 'band';

export interface PriceData {
  asset_code: string;
  asset_issuer?: string;
  price_usd: number;
  price_xlm?: number;
  timestamp: number;
  source: OracleProvider;
  confidence?: number;
}

export interface PriceHistory {
  asset_code: string;
  data_points: PricePoint[];
  timeframe: '1h' | '24h' | '7d' | '30d' | '1y';
}

export interface PricePoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface OracleConfig {
  provider: OracleProvider;
  contract_address: string;
  update_frequency: number;
  supported_assets: string[];
}
