import * as StellarSdk from '@stellar/stellar-sdk';
import { NetworkType } from '@/types/wallet';
import { getServer, getNetworkPassphrase, createAsset } from './stellar';

/**
 * Execute a swap on Stellar DEX using pathPaymentStrictSend
 */
export async function executeSDEXSwap(
  userPublicKey: string,
  fromAssetCode: string,
  fromAssetIssuer: string | undefined,
  toAssetCode: string,
  toAssetIssuer: string | undefined,
  amount: string,
  minAmount: string,
  network: NetworkType
): Promise<string> {
  const server = getServer(network);
  
  // Load source account
  const sourceAccount = await server.loadAccount(userPublicKey);
  
  // Create assets
  const sendAsset = createAsset(fromAssetCode, fromAssetIssuer);
  const destAsset = createAsset(toAssetCode, toAssetIssuer);
  
  // Build transaction
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: getNetworkPassphrase(network),
  })
    .addOperation(
      StellarSdk.Operation.pathPaymentStrictSend({
        sendAsset: sendAsset,
        sendAmount: amount,
        destination: userPublicKey,
        destAsset: destAsset,
        destMin: minAmount,
        path: [], // Can be populated with intermediate assets for better rates
      })
    )
    .setTimeout(180)
    .build();
  
  // Return XDR for signing
  return transaction.toXDR();
}

/**
 * Find best path for SDEX swap
 */
export async function findSDEXPath(
  fromAssetCode: string,
  fromAssetIssuer: string | undefined,
  toAssetCode: string,
  toAssetIssuer: string | undefined,
  amount: string,
  network: NetworkType
): Promise<any[]> {
  const server = getServer(network);
  
  const sourceAsset = createAsset(fromAssetCode, fromAssetIssuer);
  const destAsset = createAsset(toAssetCode, toAssetIssuer);
  
  try {
    // Use strict send paths to find best route
    const paths = await server
      .strictSendPaths(sourceAsset, amount, [destAsset])
      .call();
    
    return paths.records;
  } catch (error) {
    console.error('Error finding SDEX path:', error);
    return [];
  }
}

/**
 * Get orderbook for asset pair on SDEX
 */
export async function getSDEXOrderbook(
  sellingAssetCode: string,
  sellingAssetIssuer: string | undefined,
  buyingAssetCode: string,
  buyingAssetIssuer: string | undefined,
  network: NetworkType
) {
  const server = getServer(network);
  
  const sellingAsset = createAsset(sellingAssetCode, sellingAssetIssuer);
  const buyingAsset = createAsset(buyingAssetCode, buyingAssetIssuer);
  
  try {
    const orderbook = await server
      .orderbook(sellingAsset, buyingAsset)
      .call();
    
    return {
      bids: orderbook.bids,
      asks: orderbook.asks,
      base: orderbook.base,
      counter: orderbook.counter,
    };
  } catch (error) {
    console.error('Error fetching SDEX orderbook:', error);
    throw error;
  }
}

/**
 * Calculate estimated output for SDEX swap
 */
export async function estimateSDEXOutput(
  fromAssetCode: string,
  fromAssetIssuer: string | undefined,
  toAssetCode: string,
  toAssetIssuer: string | undefined,
  amount: string,
  network: NetworkType
): Promise<string> {
  const paths = await findSDEXPath(
    fromAssetCode,
    fromAssetIssuer,
    toAssetCode,
    toAssetIssuer,
    amount,
    network
  );
  
  if (paths.length === 0) {
    throw new Error('No path found for this swap');
  }
  
  // Return the destination amount from the best path
  return paths[0].destination_amount;
}

/**
 * Get recent trades for asset pair on SDEX
 */
export async function getSDEXTrades(
  baseAssetCode: string,
  baseAssetIssuer: string | undefined,
  counterAssetCode: string,
  counterAssetIssuer: string | undefined,
  network: NetworkType,
  limit: number = 10
) {
  const server = getServer(network);
  
  const baseAsset = createAsset(baseAssetCode, baseAssetIssuer);
  const counterAsset = createAsset(counterAssetCode, counterAssetIssuer);
  
  try {
    const trades = await server
      .trades()
      .forAssetPair(baseAsset, counterAsset)
      .limit(limit)
      .order('desc')
      .call();
    
    return trades.records;
  } catch (error) {
    console.error('Error fetching SDEX trades:', error);
    return [];
  }
}
