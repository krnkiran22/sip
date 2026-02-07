import { getSDEXQuote, buildSDEXSwap } from './sdex-swap';
import { getSoroswapQuote, buildSoroswapSwap } from './soroswap-swap';
import * as StellarSdk from '@stellar/stellar-sdk';

export interface OptimalQuote {
  bestDex: 'SDEX' | 'SOROSWAP';
  inputAmount: string;
  outputAmount: string;
  path: string[];
  priceImpact: number;
  sdexQuote?: any;
  soroswapQuote?: any;
  fromAssetCode: string;
  fromAssetIssuer: string | null;
  toAssetCode: string;
  toAssetIssuer: string | null;
}

/**
 * Get quotes from both DEXs and find optimal route
 */
export async function getOptimalSwapQuote(
  fromAssetCode: string,
  fromAssetIssuer: string | null, // null for XLM (native)
  toAssetCode: string,
  toAssetIssuer: string | null,
  amount: string,
  network: 'TESTNET' | 'PUBLIC' = 'TESTNET',
  soroswapApiKey?: string
): Promise<OptimalQuote> {
  try {
    // Create Stellar assets for SDEX
    const fromAsset = fromAssetIssuer
      ? new StellarSdk.Asset(fromAssetCode, fromAssetIssuer)
      : StellarSdk.Asset.native();
    
    const toAsset = toAssetIssuer
      ? new StellarSdk.Asset(toAssetCode, toAssetIssuer)
      : StellarSdk.Asset.native();

    // Always try SDEX
    const quotePromises: Promise<any>[] = [
      getSDEXQuote(fromAsset, toAsset, amount, network).catch(err => {
        console.log('SDEX quote failed:', err.message);
        return null;
      })
    ];

    // Add Soroswap if API key provided
    if (soroswapApiKey) {
      quotePromises.push(
        getSoroswapQuote(
          fromAssetIssuer || 'native', // Convert to contract address format
          toAssetIssuer || 'native',
          BigInt(parseFloat(amount) * 1e7), // Convert to stroops
          network === 'TESTNET' ? 'TESTNET' : 'MAINNET',
          soroswapApiKey
        ).catch(err => {
          console.log('Soroswap quote failed:', err.message);
          return null;
        })
      );
    }

    // Get quotes from both DEXs in parallel
    const results = await Promise.all(quotePromises);
    const sdex = results[0];
    const soroswap = results[1];

    if (!sdex && !soroswap) {
      throw new Error('No quotes available from any DEX');
    }

    // Compare output amounts to find best DEX
    const sdexOutput = sdex ? parseFloat(sdex.outputAmount) : 0;
    const soroswapOutput = soroswap ? parseFloat(soroswap.outputAmount) / 1e7 : 0;

    const bestDex = sdexOutput >= soroswapOutput ? 'SDEX' : 'SOROSWAP';
    const bestQuote = bestDex === 'SDEX' ? sdex! : soroswap!;

    return {
      bestDex,
      inputAmount: amount,
      outputAmount: bestDex === 'SDEX' 
        ? bestQuote.outputAmount 
        : soroswapOutput.toString(),
      path: bestQuote.path,
      priceImpact: bestQuote.priceImpact,
      sdexQuote: sdex,
      soroswapQuote: soroswap,
      fromAssetCode,
      fromAssetIssuer,
      toAssetCode,
      toAssetIssuer,
    };
  } catch (error) {
    console.error('Optimal quote error:', error);
    throw error;
  }
}

/**
 * Execute swap on the optimal DEX
 */
export async function executeOptimalSwap(
  optimalQuote: OptimalQuote,
  userPublicKey: string,
  slippagePercent: number = 0.5,
  network: 'TESTNET' | 'PUBLIC' = 'TESTNET',
  soroswapApiKey?: string
): Promise<string> {
  try {
    const minAmount = (
      parseFloat(optimalQuote.outputAmount) * (1 - slippagePercent / 100)
    ).toString();

    if (optimalQuote.bestDex === 'SDEX') {
      // Execute on SDEX
      const fromAsset = optimalQuote.fromAssetIssuer
        ? new StellarSdk.Asset(optimalQuote.fromAssetCode, optimalQuote.fromAssetIssuer)
        : StellarSdk.Asset.native();
      
      const toAsset = optimalQuote.toAssetIssuer
        ? new StellarSdk.Asset(optimalQuote.toAssetCode, optimalQuote.toAssetIssuer)
        : StellarSdk.Asset.native();
      
      return await buildSDEXSwap(
        userPublicKey,
        fromAsset,
        toAsset,
        optimalQuote.inputAmount,
        minAmount,
        network
      );
    } else {
      // Execute on Soroswap
      if (!soroswapApiKey) {
        throw new Error('Soroswap API key required for Soroswap execution');
      }
      
      return await buildSoroswapSwap(
        optimalQuote.soroswapQuote!.quoteData,
        userPublicKey,
        soroswapApiKey
      );
    }
  } catch (error) {
    console.error('Execute swap error:', error);
    throw error;
  }
}
