import { z } from 'zod';

// Stellar address validation
export const stellarAddressSchema = z
  .string()
  .regex(/^G[A-Z0-9]{55}$/, 'Invalid Stellar address');

// Amount validation
export const amountSchema = z
  .string()
  .or(z.number())
  .refine(
    (val) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return !isNaN(num) && num > 0;
    },
    { message: 'Amount must be a positive number' }
  );

// Slippage validation (0-100%)
export const slippageSchema = z
  .number()
  .min(0, 'Slippage must be at least 0%')
  .max(100, 'Slippage cannot exceed 100%');

// Intent text validation
export const intentTextSchema = z
  .string()
  .min(10, 'Intent must be at least 10 characters')
  .max(500, 'Intent cannot exceed 500 characters');

// Asset code validation
export const assetCodeSchema = z
  .string()
  .min(1, 'Asset code is required')
  .max(12, 'Asset code cannot exceed 12 characters')
  .regex(/^[a-zA-Z0-9]+$/, 'Asset code must be alphanumeric');

// Swap intent schema
export const swapIntentSchema = z.object({
  from_asset: assetCodeSchema,
  to_asset: assetCodeSchema,
  amount: amountSchema,
  slippage_tolerance: slippageSchema.optional(),
  dex_preference: z.enum(['soroswap', 'sdex', 'aqua', 'phoenix']).optional(),
});

// Transfer intent schema
export const transferIntentSchema = z.object({
  recipient: stellarAddressSchema,
  asset: assetCodeSchema,
  amount: amountSchema,
  memo: z.string().max(28, 'Memo cannot exceed 28 characters').optional(),
});

// Settings validation schemas
export const intentPreferencesSchema = z.object({
  default_slippage_tolerance: slippageSchema,
  max_gas_fee: amountSchema,
  auto_approve_trusted: z.boolean(),
  preferred_dex: z.enum(['soroswap', 'sdex', 'aqua', 'phoenix']).optional(),
});

export const securitySettingsSchema = z.object({
  spending_limit_daily: amountSchema.optional(),
  spending_limit_per_intent: amountSchema.optional(),
  whitelisted_addresses: z.array(stellarAddressSchema),
  session_timeout_minutes: z.number().min(5).max(1440),
  require_confirmation_above: amountSchema.optional(),
});

// Template parameter schema
export const templateParameterSchema = z.object({
  name: z.string(),
  type: z.enum(['string', 'number', 'asset', 'address']),
  required: z.boolean(),
  default: z.any().optional(),
  placeholder: z.string().optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
    })
    .optional(),
});

/**
 * Validate intent text
 */
export function validateIntentText(text: string): {
  valid: boolean;
  error?: string;
} {
  try {
    intentTextSchema.parse(text);
    return { valid: true };
  } catch (error: any) {
    return {
      valid: false,
      error: error.errors[0]?.message || 'Invalid intent text',
    };
  }
}

/**
 * Validate Stellar address
 */
export function validateAddress(address: string): {
  valid: boolean;
  error?: string;
} {
  try {
    stellarAddressSchema.parse(address);
    return { valid: true };
  } catch (error: any) {
    return {
      valid: false,
      error: error.errors[0]?.message || 'Invalid address',
    };
  }
}

/**
 * Validate amount
 */
export function validateAmount(amount: string | number): {
  valid: boolean;
  error?: string;
} {
  try {
    amountSchema.parse(amount);
    return { valid: true };
  } catch (error: any) {
    return {
      valid: false,
      error: error.errors[0]?.message || 'Invalid amount',
    };
  }
}

/**
 * Validate slippage tolerance
 */
export function validateSlippage(slippage: number): {
  valid: boolean;
  error?: string;
} {
  try {
    slippageSchema.parse(slippage);
    return { valid: true };
  } catch (error: any) {
    return {
      valid: false,
      error: error.errors[0]?.message || 'Invalid slippage',
    };
  }
}
