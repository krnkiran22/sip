import * as StellarSdk from '@stellar/stellar-sdk';

export interface SDEXQuote {
  inputAmount: string;
  outputAmount: string;
  path: string[];
  priceImpact: number;
  source: 'SDEX';
}

function calculatePriceImpact(input: string, output: string): number {
  // Simple price impact calculation
  const rate = parseFloat(output) / parseFloat(input);
  return Math.abs((1 - rate) * 100);
}

/**
 * Get SDEX quote for swap
 * @param fromAsset - Source asset (e.g., USDC)
 * @param toAsset - Destination asset (e.g., XLM)
 * @param amount - Amount to swap
 * @param network - 'TESTNET' or 'PUBLIC'
 */
export async function getSDEXQuote(
  fromAsset: StellarSdk.Asset,
  toAsset: StellarSdk.Asset,
  amount: string,
  network: 'TESTNET' | 'PUBLIC' = 'TESTNET'
): Promise<SDEXQuote> {
  try {
    const serverUrl = network === 'TESTNET'
      ? 'https://horizon-testnet.stellar.org'
      : 'https://horizon.stellar.org';
    
    const server = new StellarSdk.Horizon.Server(serverUrl);

    // Find strict send path (best rate for exact input amount)
    const pathsResponse = await server
      .strictSendPaths(fromAsset, amount, [toAsset])
      .call();

    if (pathsResponse.records.length === 0) {
      throw new Error('No path found on SDEX');
    }

    // Get best path (first record is optimal)
    const bestPath = pathsResponse.records[0];

    return {
      inputAmount: amount,
      outputAmount: bestPath.destination_amount,
      path: bestPath.path.map((asset: any) => 
        asset.asset_type === 'native' ? 'XLM' : `${asset.asset_code}:${asset.asset_issuer}`
      ),
      priceImpact: calculatePriceImpact(amount, bestPath.destination_amount),
      source: 'SDEX',
    };
  } catch (error) {
    console.error('SDEX quote error:', error);
    throw error;
  }
}

/**
 * Build SDEX swap transaction (Path Payment Strict Send)
 * @param userPublicKey - User's Stellar public key
 * @param fromAsset - Source asset
 * @param toAsset - Destination asset  
 * @param amount - Amount to send
 * @param minAmount - Minimum amount to receive (slippage protection)
 * @param network - 'TESTNET' or 'PUBLIC'
 * @returns Transaction XDR string
 */
export async function buildSDEXSwap(
  userPublicKey: string,
  fromAsset: StellarSdk.Asset,
  toAsset: StellarSdk.Asset,
  amount: string,
  minAmount: string,
  network: 'TESTNET' | 'PUBLIC' = 'TESTNET'
): Promise<string> {
  try {
    const serverUrl = network === 'TESTNET'
      ? 'https://horizon-testnet.stellar.org'
      : 'https://horizon.stellar.org';
    
    const server = new StellarSdk.Horizon.Server(serverUrl);
    const networkPassphrase = network === 'TESTNET'
      ? StellarSdk.Networks.TESTNET
      : StellarSdk.Networks.PUBLIC;

    // Load user account
    const account = await server.loadAccount(userPublicKey);

    // Get optimal path
    const pathsResponse = await server
      .strictSendPaths(fromAsset, amount, [toAsset])
      .call();

    if (pathsResponse.records.length === 0) {
      throw new Error('No path found');
    }

    const bestPath = pathsResponse.records[0];

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    })
      .addOperation(
        StellarSdk.Operation.pathPaymentStrictSend({
          sendAsset: fromAsset,
          sendAmount: amount,
          destination: userPublicKey, // Send to self
          destAsset: toAsset,
          destMin: minAmount,
          path: bestPath.path.map((asset: any) => 
            asset.asset_type === 'native' 
              ? StellarSdk.Asset.native()
              : new StellarSdk.Asset(asset.asset_code, asset.asset_issuer)
          ),
        })
      )
      .setTimeout(180)
      .build();

    return transaction.toXDR();
  } catch (error) {
    console.error('SDEX swap build error:', error);
    throw error;
  }
}
