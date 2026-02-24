import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCryptoMarkets } from '../../../services/crypto.service';
import { getStockQuotes } from '../../../services/stock.service';
import { getMockDashboardData } from '../../../services/mockData.service';

const POLL_MS = 25000;
const TRACKED_STOCKS = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL'];
const TRACKED_CRYPTO_IDS = ['bitcoin', 'ethereum', 'solana', 'dogecoin', 'ripple'];

const PORTFOLIO_POSITIONS = [
  { type: 'crypto', key: 'bitcoin', label: 'Bitcoin', quantity: 0.45, entryPrice: 61500 },
  { type: 'crypto', key: 'ethereum', label: 'Ethereum', quantity: 3.2, entryPrice: 2800 },
  { type: 'crypto', key: 'solana', label: 'Solana', quantity: 24, entryPrice: 121 },
  { type: 'stock', key: 'AAPL', label: 'Apple', quantity: 18, entryPrice: 195 },
  { type: 'stock', key: 'MSFT', label: 'Microsoft', quantity: 8, entryPrice: 378 },
  { type: 'stock', key: 'NVDA', label: 'NVIDIA', quantity: 28, entryPrice: 99 },
];

/**
 * @typedef {'up'|'down'|'same'} Movement
 */

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [crypto, setCrypto] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [movements, setMovements] = useState({});
  const previousPriceMapRef = useRef({});

  const fetchDashboardData = useCallback(async () => {
    try {
      const [cryptoData, stockData] = await Promise.all([
        getCryptoMarkets({ ids: TRACKED_CRYPTO_IDS, perPage: TRACKED_CRYPTO_IDS.length }),
        getStockQuotes(TRACKED_STOCKS),
      ]);

      setCrypto(cryptoData);
      setStocks(stockData);
      setError(null);
      setLastUpdated(new Date());

      const nextPriceMap = {};
      const movementMap = {};

      for (const coin of cryptoData) {
        const key = `crypto:${coin.id}`;
        nextPriceMap[key] = coin.currentPrice;
        const prev = previousPriceMapRef.current[key];
        movementMap[key] = prev == null ? 'same' : coin.currentPrice > prev ? 'up' : coin.currentPrice < prev ? 'down' : 'same';
      }

      for (const stock of stockData) {
        const key = `stock:${stock.symbol}`;
        nextPriceMap[key] = stock.price;
        const prev = previousPriceMapRef.current[key];
        movementMap[key] = prev == null ? 'same' : stock.price > prev ? 'up' : stock.price < prev ? 'down' : 'same';
      }

      previousPriceMapRef.current = nextPriceMap;
      setMovements(movementMap);
    } catch (requestError) {
      try {
        const fallback = await getMockDashboardData();
        const cryptoFallback = fallback.crypto.map((item) => ({
          id: item.id,
          symbol: item.symbol,
          name: item.name,
          currentPrice: item.currentPrice,
          marketCap: item.marketCap,
          change24h: item.change24h,
        }));

        setCrypto(cryptoFallback);
        setStocks(fallback.stocks);
        setError('Live market feed unavailable. Showing mock snapshot data.');
      } catch {
        setError(requestError.message || 'Failed to load dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(fetchDashboardData, POLL_MS);
    return () => clearInterval(timer);
  }, [fetchDashboardData]);

  const stockMap = useMemo(() => {
    const map = {};
    for (const item of stocks) map[item.symbol] = item;
    return map;
  }, [stocks]);

  const cryptoMap = useMemo(() => {
    const map = {};
    for (const item of crypto) map[item.id] = item;
    return map;
  }, [crypto]);

  const portfolio = useMemo(() => {
    let totalBalance = 0;
    let totalCost = 0;
    let dayDelta = 0;
    let cryptoValue = 0;
    let stockValue = 0;

    for (const position of PORTFOLIO_POSITIONS) {
      const source = position.type === 'crypto' ? cryptoMap[position.key] : stockMap[position.key];
      const currentPrice = source?.currentPrice ?? source?.price ?? 0;
      const dayMove = source?.change24h ?? source?.changePercent ?? 0;

      const value = currentPrice * position.quantity;
      const cost = position.entryPrice * position.quantity;

      totalBalance += value;
      totalCost += cost;
      dayDelta += value * (dayMove / 100);
      if (position.type === 'crypto') cryptoValue += value;
      if (position.type === 'stock') stockValue += value;
    }

    const totalPL = totalBalance - totalCost;
    const dayChangePercent = totalBalance ? (dayDelta / totalBalance) * 100 : 0;

    return {
      totalBalance,
      dayChangeValue: dayDelta,
      dayChangePercent,
      totalPL,
      allocation: {
        crypto: totalBalance ? (cryptoValue / totalBalance) * 100 : 0,
        stocks: totalBalance ? (stockValue / totalBalance) * 100 : 0,
      },
    };
  }, [cryptoMap, stockMap]);

  const watchlist = useMemo(() => {
    const cryptoRows = crypto.slice(0, 4).map((coin) => ({
      id: `crypto:${coin.id}`,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      type: 'Crypto',
      price: coin.currentPrice,
      changePercent: coin.change24h,
    }));

    const stockRows = stocks.slice(0, 4).map((stock) => ({
      id: `stock:${stock.symbol}`,
      symbol: stock.symbol,
      name: stock.symbol,
      type: 'Stock',
      price: stock.price,
      changePercent: stock.changePercent,
    }));

    return [...cryptoRows, ...stockRows].slice(0, 8);
  }, [crypto, stocks]);

  const combinedMarket = useMemo(() => {
    const cryptoRows = crypto.map((coin) => ({
      id: `crypto:${coin.id}`,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      type: 'Crypto',
      price: coin.currentPrice,
      changePercent: coin.change24h,
      activity: coin.marketCap,
    }));

    const stockRows = stocks.map((stock) => ({
      id: `stock:${stock.symbol}`,
      name: stock.symbol,
      symbol: stock.symbol,
      type: 'Stock',
      price: stock.price,
      changePercent: stock.changePercent,
      activity: Math.abs(stock.change) * 1_000_000 + stock.price * 100_000,
    }));

    return [...cryptoRows, ...stockRows];
  }, [crypto, stocks]);

  const marketOverview = useMemo(() => {
    const gainers = [...combinedMarket]
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);
    const losers = [...combinedMarket]
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);
    const mostActive = [...combinedMarket]
      .sort((a, b) => b.activity - a.activity)
      .slice(0, 5);

    return { gainers, losers, mostActive };
  }, [combinedMarket]);

  return {
    loading,
    error,
    lastUpdated,
    portfolio,
    watchlist,
    marketOverview,
    movements,
    refresh: fetchDashboardData,
  };
}

export default useDashboardData;

