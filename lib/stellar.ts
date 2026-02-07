import * as StellarSdk from '@stellar/stellar-sdk';
import { NetworkType } from '@/types/wallet';
import { NETWORKS } from './constants';

/**
 * Get Stellar Server instance for the specified network
 */
export function getServer(network: NetworkType): StellarSdk.Horizon.Server {
  return new StellarSdk.Horizon.Server(NETWORKS[network].url);
}

/**
 * Get network passphrase
 */
export function getNetworkPassphrase(network: NetworkType): string {
  return NETWORKS[network].passphrase;
}

/**
 * Load account from the network
 */
export async function loadAccount(
  address: string,
  network: NetworkType
): Promise<any> {
  const server = getServer(network);
  return await server.loadAccount(address);
}

/**
 * Get account balances
 */
export async function getAccountBalances(
  address: string,
  network: NetworkType
): Promise<any[]> {
  const account = await loadAccount(address, network);
  return account.balances;
}

/**
 * Build a basic payment transaction
 */
export async function buildPaymentTransaction(
  sourceAddress: string,
  destinationAddress: string,
  asset: StellarSdk.Asset,
  amount: string,
  network: NetworkType,
  memo?: string
): Promise<StellarSdk.Transaction> {
  const server = getServer(network);
  const sourceAccount = await server.loadAccount(sourceAddress);
  
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: getNetworkPassphrase(network),
  });

  transaction.addOperation(
    StellarSdk.Operation.payment({
      destination: destinationAddress,
      asset: asset,
      amount: amount,
    })
  );

  if (memo) {
    transaction.addMemo(StellarSdk.Memo.text(memo));
  }

  transaction.setTimeout(180);

  return transaction.build();
}

/**
 * Build a swap transaction (path payment)
 */
export async function buildSwapTransaction(
  sourceAddress: string,
  sendAsset: StellarSdk.Asset,
  sendAmount: string,
  destAsset: StellarSdk.Asset,
  destMin: string,
  network: NetworkType
): Promise<StellarSdk.Transaction> {
  const server = getServer(network);
  const sourceAccount = await server.loadAccount(sourceAddress);
  
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: getNetworkPassphrase(network),
  });

  transaction.addOperation(
    StellarSdk.Operation.pathPaymentStrictSend({
      sendAsset: sendAsset,
      sendAmount: sendAmount,
      destination: sourceAddress,
      destAsset: destAsset,
      destMin: destMin,
    })
  );

  transaction.setTimeout(180);

  return transaction.build();
}

/**
 * Submit a signed transaction
 */
export async function submitTransaction(
  signedXdr: string,
  network: NetworkType
): Promise<StellarSdk.Horizon.HorizonApi.SubmitTransactionResponse> {
  const server = getServer(network);
  const transaction = new StellarSdk.Transaction(
    signedXdr,
    getNetworkPassphrase(network)
  );
  return await server.submitTransaction(transaction);
}

/**
 * Get transaction details
 */
export async function getTransaction(
  hash: string,
  network: NetworkType
): Promise<StellarSdk.Horizon.ServerApi.TransactionRecord> {
  const server = getServer(network);
  return await server.transactions().transaction(hash).call();
}

/**
 * Get transaction history for an account
 */
export async function getTransactionHistory(
  address: string,
  network: NetworkType,
  limit: number = 10
): Promise<StellarSdk.Horizon.ServerApi.TransactionRecord[]> {
  const server = getServer(network);
  const transactions = await server
    .transactions()
    .forAccount(address)
    .limit(limit)
    .order('desc')
    .call();
  
  return transactions.records;
}

/**
 * Find payment paths
 */
export async function findPaymentPaths(
  sourceAddress: string,
  destinationAddress: string,
  destinationAsset: StellarSdk.Asset,
  destinationAmount: string,
  network: NetworkType
): Promise<StellarSdk.Horizon.ServerApi.PaymentPathRecord[]> {
  const server = getServer(network);
  const paths = await server
    .strictReceivePaths(sourceAddress, destinationAsset, destinationAmount)
    .call();
  
  return paths.records;
}

/**
 * Create asset from code and issuer
 */
export function createAsset(code: string, issuer?: string): StellarSdk.Asset {
  if (code === 'XLM' || code === 'native') {
    return StellarSdk.Asset.native();
  }
  if (!issuer) {
    throw new Error('Issuer required for non-native assets');
  }
  return new StellarSdk.Asset(code, issuer);
}

/**
 * Check if account exists on network
 */
export async function accountExists(
  address: string,
  network: NetworkType
): Promise<boolean> {
  try {
    await loadAccount(address, network);
    return true;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Get minimum account balance (base reserve)
 */
export function getMinimumBalance(numSubentries: number = 0): string {
  const baseReserve = 0.5; // 0.5 XLM base reserve
  const subentryReserve = 0.5; // 0.5 XLM per subentry
  return (baseReserve + numSubentries * subentryReserve).toFixed(7);
}

/**
 * Estimate transaction fee
 */
export function estimateFee(numOperations: number = 1): string {
  const baseFee = 100; // 100 stroops base fee
  return (baseFee * numOperations).toString();
}
