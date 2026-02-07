import { format, formatDistance, formatRelative } from 'date-fns';

/**
 * Format Stellar address for display (shows first 4 and last 4 characters)
 */
export function formatAddress(address: string, length: number = 4): string {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export function formatNumber(num: number, decimals: number = 2): string {
  if (num === 0) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 1e9) {
    return sign + (absNum / 1e9).toFixed(decimals) + 'B';
  }
  if (absNum >= 1e6) {
    return sign + (absNum / 1e6).toFixed(decimals) + 'M';
  }
  if (absNum >= 1e3) {
    return sign + (absNum / 1e3).toFixed(decimals) + 'K';
  }
  return sign + absNum.toFixed(decimals);
}

/**
 * Format amount with token symbol
 */
export function formatAmount(
  amount: string | number,
  decimals: number = 2,
  symbol?: string
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = numAmount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return symbol ? `${formatted} ${symbol}` : formatted;
}

/**
 * Format USD amount
 */
export function formatUSD(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format date relative to now (e.g., "2 hours ago")
 */
export function formatDateRelative(date: string | Date): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

/**
 * Format date with specific format
 */
export function formatDate(date: string | Date, formatStr: string = 'PPpp'): string {
  return format(new Date(date), formatStr);
}

/**
 * Format timestamp
 */
export function formatTimestamp(timestamp: number): string {
  return format(new Date(timestamp * 1000), 'PPpp');
}

/**
 * Format gas fee from stroops to XLM
 */
export function formatGasFee(stroops: string | number): string {
  const xlm = typeof stroops === 'string' ? parseInt(stroops) : stroops;
  return formatAmount(xlm / 10000000, 7, 'XLM');
}

/**
 * Parse amount to stroops
 */
export function toStroops(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return Math.floor(num * 10000000).toString();
}

/**
 * Parse stroops to XLM
 */
export function fromStroops(stroops: string | number): number {
  const num = typeof stroops === 'string' ? parseInt(stroops) : stroops;
  return num / 10000000;
}

/**
 * Validate Stellar address
 */
export function isValidAddress(address: string): boolean {
  return /^G[A-Z0-9]{55}$/.test(address);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Generate explorer URL for transaction
 */
export function getExplorerUrl(
  hash: string,
  network: 'mainnet' | 'testnet',
  type: 'tx' | 'account' | 'asset' = 'tx'
): string {
  const baseUrl = network === 'mainnet'
    ? 'https://stellar.expert/explorer/public'
    : 'https://stellar.expert/explorer/testnet';
  return `${baseUrl}/${type}/${hash}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Calculate price impact percentage
 */
export function calculatePriceImpact(
  amountIn: number,
  amountOut: number,
  marketPrice: number
): number {
  const executionPrice = amountIn / amountOut;
  return ((executionPrice - marketPrice) / marketPrice) * 100;
}

/**
 * Format slippage tolerance
 */
export function formatSlippage(slippage: number): string {
  return `${slippage}%`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate random ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
