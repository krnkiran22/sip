export class SIPError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SIPError';
  }
}

export class WalletError extends SIPError {
  constructor(message: string, details?: any) {
    super(message, 'WALLET_ERROR', details);
    this.name = 'WalletError';
  }
}

export class NetworkError extends SIPError {
  constructor(message: string, details?: any) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

export class TransactionError extends SIPError {
  constructor(message: string, details?: any) {
    super(message, 'TRANSACTION_ERROR', details);
    this.name = 'TransactionError';
  }
}

export class ParseError extends SIPError {
  constructor(message: string, details?: any) {
    super(message, 'PARSE_ERROR', details);
    this.name = 'ParseError';
  }
}

export class ValidationError extends SIPError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * Handle and format errors for display
 */
export function handleError(error: any): string {
  if (error instanceof SIPError) {
    return error.message;
  }

  if (error.response) {
    // Horizon API error
    const extras = error.response.data?.extras;
    if (extras?.result_codes) {
      return `Transaction failed: ${JSON.stringify(extras.result_codes)}`;
    }
    return error.response.data?.title || 'Transaction failed';
  }

  if (error.message) {
    return error.message;
  }

  return 'An unknown error occurred';
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: any): boolean {
  if (error instanceof NetworkError) {
    return true;
  }

  if (error.response?.status === 504 || error.response?.status === 503) {
    return true;
  }

  return false;
}
