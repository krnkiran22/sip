export interface NotificationPreferences {
  intent_completed: boolean;
  intent_failed: boolean;
  price_alerts: boolean;
  weekly_summary: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

export interface SecuritySettings {
  spending_limit_daily?: string;
  spending_limit_per_intent?: string;
  whitelisted_addresses: string[];
  session_timeout_minutes: number;
  require_confirmation_above?: string;
}

export interface IntentPreferences {
  default_slippage_tolerance: number;
  max_gas_fee: string;
  auto_approve_trusted: boolean;
  preferred_dex?: string;
  preferred_solver?: string;
}

export interface DeveloperSettings {
  api_key?: string;
  webhook_url?: string;
  advanced_mode: boolean;
  debug_mode: boolean;
  test_mode: boolean;
}

export interface UserSettings {
  wallet_preferences: {
    default_wallet?: string;
    auto_connect: boolean;
    default_network: 'mainnet' | 'testnet';
  };
  intent_preferences: IntentPreferences;
  notifications: NotificationPreferences;
  security: SecuritySettings;
  developer?: DeveloperSettings;
  theme: 'light' | 'dark' | 'system';
  language: string;
}
