import * as StellarSdk from '@stellar/stellar-sdk';
import { ParsedIntent } from '@/types/intent';
import { NetworkType } from '@/types/wallet';
import { executeSDEXSwap, estimateSDEXOutput, findSDEXPath } from './sdex';
import { getSoroswapQuote, buildSoroswapSwap } from './soroswap';
import { getNetworkPassphrase } from './stellar';

/**
 * Main service for executing intents using Freighter wallet
 */
export class IntentExecutor {
  private network: NetworkType;
  private userPublicKey: string;

  constructor(network: NetworkType, userPublicKey: string) {
    this.network = network;
    this.userPublicKey = userPublicKey;
  }

  /**
   * Execute a swap intent
   */
  async executeSwap(
    fromAsset: string,
    fromIssuer: string | undefined,
    toAsset: string,
    toIssuer: string | undefined,
    amount: string,
    preferredDex?: 'sdex' | 'soroswap',
    slippageTolerance: number = 1.0
  ): Promise<string> {
    // Get quotes from both DEXs
    const quotes = await this.getSwapQuotes(
      fromAsset,
      fromIssuer,
      toAsset,
      toIssuer,
      amount
    );

    // Determine best DEX
    const dex = preferredDex || quotes.bestDex;

    let transactionXDR: string;

    if (dex === 'sdex') {
      // Calculate minimum output with slippage
      const minOutput = (
        parseFloat(quotes.sdex.output) *
        (1 - slippageTolerance / 100)
      ).toFixed(7);

      transactionXDR = await executeSDEXSwap(
        this.userPublicKey,
        fromAsset,
        fromIssuer,
        toAsset,
        toIssuer,
        amount,
        minOutput,
        this.network
      );
    } else {
      // Soroswap
      const minOutput = (
        parseFloat(quotes.soroswap.output) *
        (1 - slippageTolerance / 100)
      ).toFixed(7);

      transactionXDR = await buildSoroswapSwap(
        this.userPublicKey,
        fromAsset,
        toAsset,
        amount,
        minOutput,
        this.network
      );
    }

    // Sign with Freighter
    const signedXDR = await this.signWithFreighter(transactionXDR);

    // Submit to network
    const txHash = await this.submitTransaction(signedXDR);

    return txHash;
  }

  /**
   * Get quotes from multiple DEXs
   */
  async getSwapQuotes(
    fromAsset: string,
    fromIssuer: string | undefined,
    toAsset: string,
    toIssuer: string | undefined,
    amount: string
  ): Promise<{
    sdex: { output: string; priceImpact: number };
    soroswap: { output: string; priceImpact: number };
    bestDex: 'sdex' | 'soroswap';
  }> {
    // Get SDEX quote
    let sdexOutput = '0';
    let sdexPriceImpact = 0;

    try {
      sdexOutput = await estimateSDEXOutput(
        fromAsset,
        fromIssuer,
        toAsset,
        toIssuer,
        amount,
        this.network
      );
      // Calculate price impact for SDEX (simplified)
      sdexPriceImpact = 0.5;
    } catch (error) {
      console.error('SDEX quote error:', error);
    }

    // Get Soroswap quote
    let soroswapOutput = '0';
    let soroswapPriceImpact = 0;

    try {
      const quote = await getSoroswapQuote(
        fromAsset,
        toAsset,
        amount,
        this.network
      );
      soroswapOutput = quote.amountOut;
      soroswapPriceImpact = quote.priceImpact;
    } catch (error) {
      console.error('Soroswap quote error:', error);
    }

    // Determine best DEX
    const bestDex =
      parseFloat(sdexOutput) > parseFloat(soroswapOutput) ? 'sdex' : 'soroswap';

    return {
      sdex: { output: sdexOutput, priceImpact: sdexPriceImpact },
      soroswap: { output: soroswapOutput, priceImpact: soroswapPriceImpact },
      bestDex,
    };
  }

  /**
   * Sign transaction with Freighter wallet
   */
  async signWithFreighter(xdr: string): Promise<string> {
    if (!window.freighterApi) {
      throw new Error('Freighter wallet not available');
    }

    try {
      const networkPassphrase = getNetworkPassphrase(this.network);
      const signedXDR = await window.freighterApi.signTransaction(
        xdr,
        networkPassphrase
      );
      return signedXDR;
    } catch (error: any) {
      throw new Error(`Failed to sign transaction: ${error.message}`);
    }
  }

  /**
   * Submit signed transaction to Horizon
   */
  async submitTransaction(signedXDR: string): Promise<string> {
    const horizonUrl =
      this.network === 'mainnet'
        ? 'https://horizon.stellar.org'
        : 'https://horizon-testnet.stellar.org';

    const server = new StellarSdk.Horizon.Server(horizonUrl);

    try {
      const transaction = new StellarSdk.Transaction(
        signedXDR,
        getNetworkPassphrase(this.network)
      );

      const result = await server.submitTransaction(transaction);
      return result.hash;
    } catch (error: any) {
      console.error('Transaction submission error:', error);
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }

  /**
   * Execute parsed intent
   */
  async executeIntent(intent: ParsedIntent): Promise<string> {
    const operation = intent.parsed_intent.operations[0];

    if (operation.type === 'swap') {
      return await this.executeSwap(
        operation.from_asset || '',
        undefined, // Add issuer lookup logic
        operation.to_asset || '',
        undefined, // Add issuer lookup logic
        operation.amount || '0',
        operation.protocol as 'sdex' | 'soroswap' | undefined,
        intent.slippage_tolerance
      );
    }

    throw new Error(`Unsupported operation type: ${operation.type}`);
  }
}

/**
 * Helper function to create intent executor
 */
export function createIntentExecutor(
  network: NetworkType,
  userPublicKey: string
): IntentExecutor {
  return new IntentExecutor(network, userPublicKey);
}
