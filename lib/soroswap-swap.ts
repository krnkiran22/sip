import { SoroswapSDK, SupportedProtocols, TradeType, SupportedNetworks } from '@soroswap/sdk';

export interface SoroswapQuote {
  inputAmount: string;
  outputAmount: string;
  path: string[];
  protocols: string[];
  priceImpact: number;
  source: 'SOROSWAP';
  quoteData: any; // Store full quote for execution
}

/**
 * Get Soroswap quote (aggregates SDEX, Soroswap AMM, Phoenix, Aqua)
 * @param assetInAddress - Input token contract address
 * @param assetOutAddress - Output token contract address
 * @param amount - Amount to swap (as BigInt)
 * @param network - 'TESTNET' or 'MAINNET'
 * @param apiKey - Soroswap API key
 */
export async function getSoroswapQuote(
  assetInAddress: string,
  assetOutAddress: string,
  amount: bigint,
  network: 'TESTNET' | 'MAINNET' = 'TESTNET',
  apiKey: string
): Promise<SoroswapQuote> {
  try {
    const soroswapClient = new SoroswapSDK({
      apiKey,
      defaultNetwork: network === 'TESTNET' 
        ? SupportedNetworks.TESTNET 
        : SupportedNetworks.MAINNET,
    });

    // Get quote (aggregates across all protocols)
    const quote = await soroswapClient.quote({
      assetIn: assetInAddress,
      assetOut: assetOutAddress,
      amount: amount,
      tradeType: TradeType.EXACT_IN,
      protocols: [
        SupportedProtocols.SDEX,      // Stellar DEX
        SupportedProtocols.SOROSWAP,  // Soroswap AMM
        SupportedProtocols.PHOENIX,   // Phoenix DEX
        SupportedProtocols.AQUA,      // Aquarius
      ],
      slippageBps: '50', // 0.5% slippage
    });

    return {
      inputAmount: amount.toString(),
      outputAmount: quote.outputAmount.toString(),
      path: quote.path || [],
      protocols: quote.protocols || [],
      priceImpact: parseFloat(quote.priceImpact || '0'),
      source: 'SOROSWAP',
      quoteData: quote, // Store for execution
    };
  } catch (error) {
    console.error('Soroswap quote error:', error);
    throw error;
  }
}

/**
 * Build Soroswap swap transaction
 * @param quote - Quote from getSoroswapQuote
 * @param userAddress - User's Stellar address
 * @param apiKey - Soroswap API key
 * @returns Transaction XDR string
 */
export async function buildSoroswapSwap(
  quote: any, // The quoteData from getSoroswapQuote
  userAddress: string,
  apiKey: string
): Promise<string> {
  try {
    const soroswapClient = new SoroswapSDK({ apiKey });

    // Build transaction from quote
    const buildResponse = await soroswapClient.build({
      quote: quote,
      from: userAddress,
      to: userAddress, // Can be different recipient
    });

    if (!buildResponse.xdr) {
      throw new Error('Failed to build Soroswap transaction');
    }

    return buildResponse.xdr;
  } catch (error) {
    console.error('Soroswap swap build error:', error);
    throw error;
  }
}
