/** @type {import('../types/api').MarketAsset[]} */
export const mockCryptoAssets = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    currentPrice: 97250,
    marketCap: 1890000000000,
    change24h: 2.63,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    currentPrice: 5230,
    marketCap: 630000000000,
    change24h: -1.13,
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    currentPrice: 202,
    marketCap: 92000000000,
    change24h: 4.72,
  },
];

/** @type {import('../types/api').StockQuote[]} */
export const mockStockQuotes = [
  { symbol: 'AAPL', price: 242.11, change: 1.19, changePercent: 0.49 },
  { symbol: 'MSFT', price: 489.73, change: -2.13, changePercent: -0.43 },
  { symbol: 'NVDA', price: 130.44, change: 3.02, changePercent: 2.37 },
];

export async function getMockDashboardData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ crypto: mockCryptoAssets, stocks: mockStockQuotes });
    }, 450);
  });
}
