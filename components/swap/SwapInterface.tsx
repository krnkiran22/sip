'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/store/walletStore';
import { getOptimalSwapQuote, executeOptimalSwap } from '@/lib/optimalSwap';
import { signTransaction } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';
import { TESTNET_TOKENS } from '@/lib/constants';
import { ArrowDownUp, Loader2, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export function SwapInterface() {
  const { address, network } = useWalletStore();
  const [fromToken, setFromToken] = useState<'USDC' | 'XLM'>('USDC');
  const [toToken, setToToken] = useState<'USDC' | 'XLM'>('XLM');
  const [fromAmount, setFromAmount] = useState('');
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Get quote when amount changes (with debounce)
  useEffect(() => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setQuote(null);
      return;
    }

    const timer = setTimeout(() => {
      fetchQuote();
    }, 800); // Debounce 800ms

    return () => clearTimeout(timer);
  }, [fromAmount, fromToken, toToken]);

  const fetchQuote = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;

    setQuoteLoading(true);
    setError('');

    try {
      const fromTokenData = TESTNET_TOKENS[fromToken];
      const toTokenData = TESTNET_TOKENS[toToken];

      const optimalQuote = await getOptimalSwapQuote(
        fromTokenData.code,
        fromTokenData.issuer,
        toTokenData.code,
        toTokenData.issuer,
        fromAmount,
        network === 'testnet' ? 'TESTNET' : 'PUBLIC'
        // No Soroswap API key - SDEX only
      );

      setQuote(optimalQuote);
      console.log('📊 Quote received:', optimalQuote);
    } catch (err: any) {
      console.error('Quote error:', err);
      setError(err.message || 'Failed to get quote');
      setQuote(null);
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!quote || !address) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Step 1: Build transaction
      console.log('🔨 Building transaction...');
      const xdr = await executeOptimalSwap(
        quote,
        address,
        0.5, // 0.5% slippage
        network === 'testnet' ? 'TESTNET' : 'PUBLIC'
      );

      console.log('📝 Transaction built, requesting signature...');

      // Step 2: Sign with Freighter
      const signResult = await signTransaction(xdr, {
        network: network === 'testnet' ? 'TESTNET' : 'PUBLIC',
      });

      if (signResult.error) {
        throw new Error(signResult.error);
      }

      console.log('✍️ Transaction signed, submitting to network...');

      // Step 3: Submit to network
      const server = new StellarSdk.Horizon.Server(
        network === 'testnet'
          ? 'https://horizon-testnet.stellar.org'
          : 'https://horizon.stellar.org'
      );

      const transaction = StellarSdk.TransactionBuilder.fromXDR(
        signResult.signedTxXdr,
        network === 'testnet' ? StellarSdk.Networks.TESTNET : StellarSdk.Networks.PUBLIC
      );

      const result = await server.submitTransaction(transaction as any);

      console.log('✅ Swap successful!', result);
      setSuccess(`Swap completed successfully! Hash: ${result.hash.slice(0, 8)}...`);
      
      // Reset form
      setFromAmount('');
      setQuote(null);
    } catch (err: any) {
      console.error('❌ Swap error:', err);
      setError(err.message || 'Swap failed');
    } finally {
      setLoading(false);
    }
  };

  const switchTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  return (
    <GlassCard className="p-1 max-w-2xl mx-auto">
      <div className="bg-[#030005]/50 rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
            AI Intent Engine
          </span>
          <span className="text-[10px] text-white/30 ml-auto">REALTIME QUOTES</span>
        </div>

        {/* From Token */}
        <div className="mb-2">
          <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">
            From
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 px-4 py-4 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9200E1]/50 focus:border-[#9200E1]/50 text-2xl font-bold text-white placeholder:text-white/20 transition-all"
              placeholder="0.00"
              step="0.01"
            />
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value as any)}
              className="px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9200E1]/50 text-white font-bold transition-all cursor-pointer"
            >
              <option value="USDC" className="bg-[#030005]">USDC</option>
              <option value="XLM" className="bg-[#030005]">XLM</option>
            </select>
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center my-3">
          <button
            onClick={switchTokens}
            className="p-2 bg-white/[0.05] border border-white/10 rounded-lg hover:bg-white/[0.08] hover:border-[#9200E1]/50 transition-all"
          >
            <ArrowDownUp className="h-5 w-5 text-purple-400" />
          </button>
        </div>

        {/* To Token */}
        <div className="mb-6">
          <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">
            To (estimated)
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-4 bg-white/[0.03] border border-white/10 rounded-xl">
              <div className="text-2xl font-bold text-white">
                {quoteLoading ? (
                  <span className="flex items-center gap-2 text-white/40">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading...
                  </span>
                ) : quote ? (
                  parseFloat(quote.outputAmount).toFixed(4)
                ) : (
                  <span className="text-white/20">0.00</span>
                )}
              </div>
            </div>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value as any)}
              className="px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9200E1]/50 text-white font-bold transition-all cursor-pointer"
            >
              <option value="XLM" className="bg-[#030005]">XLM</option>
              <option value="USDC" className="bg-[#030005]">USDC</option>
            </select>
          </div>
        </div>

        {/* Quote Details */}
        {quote && !quoteLoading && (
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl mb-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40 text-xs uppercase tracking-wider">Best DEX</span>
              <span className="font-bold text-[#9200E1] flex items-center gap-2">
                <Zap className="h-3 w-3" />
                {quote.bestDex}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40 text-xs uppercase tracking-wider">Price Impact</span>
              <span className="font-semibold text-emerald-400">{quote.priceImpact.toFixed(2)}%</span>
            </div>
            {quote.path && quote.path.length > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40 text-xs uppercase tracking-wider">Route</span>
                <span className="text-white/60 text-xs">{quote.path.length} hops</span>
              </div>
            )}

            {/* Comparison */}
            {quote.sdexQuote && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-1 rounded-full bg-blue-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    SDEX Output
                  </p>
                </div>
                <p className="text-sm font-semibold text-white/80">
                  {parseFloat(quote.sdexQuote.outputAmount).toFixed(4)} {toToken}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-300">{success}</p>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={loading || !quote || !address || quoteLoading}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#9200E1] to-[#4d65ff] hover:from-[#b026ff] hover:to-[#6b7fff] text-white rounded-full font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(146,0,225,0.3)] hover:shadow-[0_0_40px_rgba(146,0,225,0.5)] text-lg tracking-tight"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {loading
            ? 'Executing...'
            : !address
            ? 'Connect Wallet'
            : !quote
            ? 'Enter Amount'
            : `Swap on ${quote.bestDex}`}
        </button>

        {/* Info Tags */}
        <div className="flex gap-2 mt-4 justify-center">
          {['REALTIME', 'BEST RATE', 'ZERO FEES'].map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-white/40 border border-white/10 text-[10px] font-bold tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
