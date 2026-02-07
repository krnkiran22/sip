export type DEXProtocol = 'soroswap' | 'sdex' | 'aqua' | 'phoenix';

export interface TokenInfo {
  code: string;
  issuer?: string;
  name: string;
  logo?: string;
  decimals: number;
  contract_address?: string;
}

export interface SwapQuote {
  dex: DEXProtocol;
  from_token: TokenInfo;
  to_token: TokenInfo;
  amount_in: string;
  amount_out: string;
  price_impact: number;
  estimated_gas: string;
  route: RouteStep[];
  valid_until: number;
}

export interface RouteStep {
  dex: DEXProtocol;
  pool_address?: string;
  from_token: string;
  to_token: string;
  amount_in: string;
  amount_out: string;
}

export interface AggregatedQuotes {
  best_quote: SwapQuote;
  all_quotes: SwapQuote[];
  timestamp: number;
}

export interface DEXConfig {
  name: string;
  protocol: DEXProtocol;
  logo: string;
  router_contract?: string;
  factory_contract?: string;
  supported: boolean;
}

export interface LiquidityPool {
  pool_id: string;
  dex: DEXProtocol;
  token_a: TokenInfo;
  token_b: TokenInfo;
  reserve_a: string;
  reserve_b: string;
  total_shares: string;
  fee_percent: number;
}
