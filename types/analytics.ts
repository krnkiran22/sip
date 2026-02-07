export interface PortfolioData {
  total_value_usd: number;
  total_value_xlm: number;
  assets: AssetHolding[];
  change_24h: number;
  change_7d: number;
  change_30d: number;
}

export interface AssetHolding {
  asset_code: string;
  asset_issuer?: string;
  balance: string;
  value_usd: number;
  value_xlm: number;
  percentage: number;
  price_change_24h: number;
}

export interface IntentAnalytics {
  total_intents: number;
  successful_intents: number;
  failed_intents: number;
  pending_intents: number;
  success_rate: number;
  total_volume_usd: number;
  total_gas_spent: string;
  most_used_action: string;
  avg_execution_time: number;
}

export interface ProtocolStats {
  total_users: number;
  total_intents_executed: number;
  total_volume_usd: number;
  total_value_locked: number;
  dex_distribution: DEXUsage[];
  trending_intents: TrendingIntent[];
  last_updated: number;
}

export interface DEXUsage {
  dex: string;
  volume_usd: number;
  transaction_count: number;
  percentage: number;
}

export interface TrendingIntent {
  action: string;
  count: number;
  growth_percent: number;
}

export interface TimeSeriesData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}
