import { DEXConfig, TokenInfo } from '@/types/dex';

// Network configurations
export const NETWORKS = {
  mainnet: {
    url: 'https://horizon.stellar.org',
    passphrase: 'Public Global Stellar Network ; September 2015',
    explorer: 'https://stellar.expert/explorer/public',
  },
  testnet: {
    url: 'https://horizon-testnet.stellar.org',
    passphrase: 'Test SDF Network ; September 2015',
    explorer: 'https://stellar.expert/explorer/testnet',
  },
};

// DEX configurations
export const DEX_CONFIGS: DEXConfig[] = [
  {
    name: 'Soroswap',
    protocol: 'soroswap',
    logo: '/logos/soroswap.png',
    router_contract: 'SOROSWAP_ROUTER_CONTRACT',
    factory_contract: 'SOROSWAP_FACTORY_CONTRACT',
    supported: true,
  },
  {
    name: 'Stellar DEX',
    protocol: 'sdex',
    logo: '/logos/stellar.png',
    supported: true,
  },
  {
    name: 'Aquarius',
    protocol: 'aqua',
    logo: '/logos/aqua.png',
    supported: true,
  },
  {
    name: 'Phoenix',
    protocol: 'phoenix',
    logo: '/logos/phoenix.png',
    router_contract: 'PHOENIX_ROUTER_CONTRACT',
    supported: true,
  },
];

// Common Stellar tokens
export const COMMON_TOKENS: TokenInfo[] = [
  {
    code: 'XLM',
    name: 'Stellar Lumens',
    decimals: 7,
    logo: '/logos/xlm.png',
  },
  {
    code: 'USDC',
    issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    name: 'USD Coin',
    decimals: 7,
    logo: '/logos/usdc.png',
    contract_address: 'USDC_CONTRACT_ADDRESS',
  },
  {
    code: 'AQUA',
    issuer: 'GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA',
    name: 'Aquarius',
    decimals: 7,
    logo: '/logos/aqua.png',
  },
  {
    code: 'yXLM',
    issuer: 'GARDNV3Q7YGT4AKSDF25LT32YSCCW4EV22Y2TV3I2PU2MMXJTEDL5T55',
    name: 'Yield XLM',
    decimals: 7,
    logo: '/logos/yxlm.png',
  },
];

// Intent action types
export const INTENT_ACTIONS = [
  { value: 'swap', label: 'Swap', description: 'Exchange one token for another' },
  { value: 'lend', label: 'Lend', description: 'Lend assets to earn interest' },
  { value: 'borrow', label: 'Borrow', description: 'Borrow assets with collateral' },
  { value: 'stake', label: 'Stake', description: 'Stake tokens to earn rewards' },
  { value: 'bridge', label: 'Bridge', description: 'Transfer assets across chains' },
  { value: 'yield', label: 'Yield', description: 'Optimize yield farming' },
];

// Intent status configurations
export const INTENT_STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-500',
    icon: 'FileEdit',
  },
  pending: {
    label: 'Pending',
    color: 'bg-yellow-500',
    icon: 'Clock',
  },
  executing: {
    label: 'Executing',
    color: 'bg-blue-500',
    icon: 'Loader',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-500',
    icon: 'CheckCircle',
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-500',
    icon: 'XCircle',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-gray-500',
    icon: 'Ban',
  },
};

// Example intents
export const EXAMPLE_INTENTS = [
  'Swap 100 XLM for USDC on Soroswap',
  'Lend 1000 USDC to Blend Protocol',
  'Buy XLM when price drops below $0.10',
  'DCA $50 into AQUA every week',
  'Stake 500 yXLM for maximum yield',
  'Bridge 100 USDC from Ethereum to Stellar',
];

// Gas fee estimates (in stroops)
export const GAS_ESTIMATES = {
  simple_swap: '100000',
  complex_swap: '500000',
  lending: '200000',
  staking: '150000',
  bridge: '1000000',
};

// Slippage tolerance presets
export const SLIPPAGE_PRESETS = [0.1, 0.5, 1.0, 2.0, 5.0];

// Oracle providers
export const ORACLE_PROVIDERS = [
  { name: 'DIA', value: 'dia', contract: 'DIA_CONTRACT_ADDRESS' },
  { name: 'Reflector', value: 'reflector', contract: 'REFLECTOR_CONTRACT_ADDRESS' },
  { name: 'Band Protocol', value: 'band', contract: 'BAND_CONTRACT_ADDRESS' },
];

// Chart color schemes
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
};

// Date range presets for analytics
export const DATE_RANGES = [
  { label: '24 Hours', value: '24h' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: '1 Year', value: '1y' },
  { label: 'All Time', value: 'all' },
];
