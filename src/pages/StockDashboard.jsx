import React, { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import DataContext from '../context/DataContext';
import { fetchExchangeRate } from '../services/stockAPI';
import StockBarChart from '../charts/StockBarChart';
import PriceCard from '../components/PriceCard';
import { useTimeframe } from '../context/TimeframeContext';
import { Skeleton } from '../components/ui/Skeleton';

const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX'];

const parseNumber = (value) => Number.parseFloat(String(value ?? '0').replace('%', ''));

const StockDashboard = () => {
  const { stocksData, fetchMultipleStockQuotes } = useContext(DataContext);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currency, setCurrency] = useState('EUR');
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const { timeframe, stockPoints } = useTimeframe();

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const fxRes = await fetchExchangeRate('USD', currency);
        const rate = parseFloat(fxRes.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
        setExchangeRate(rate);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    fetchRate();
  }, [currency]);

  useEffect(() => {
    fetchMultipleStockQuotes(DEFAULT_SYMBOLS);
  }, [fetchMultipleStockQuotes]);

  const enrichedStocks = useMemo(() => {
    return Object.entries(stocksData || {})
      .map(([symbol, data]) => {
        const priceUSD = parseNumber(data?.['05. price']);
        const change = parseNumber(data?.['09. change']);
        const changePercent = parseNumber(data?.['10. change percent']);
        const previousClose = parseNumber(data?.['08. previous close']);
        const convertedPrice = exchangeRate ? priceUSD * exchangeRate : 0;

        return {
          symbol,
          priceUSD,
          convertedPrice,
          change,
          changePercent,
          previousClose,
          volatility: Math.abs(changePercent),
        };
      })
      .filter((item) => Number.isFinite(item.priceUSD) && item.priceUSD > 0);
  }, [stocksData, exchangeRate]);

  useEffect(() => {
    if (!enrichedStocks.length) return;
    const selectedExists = enrichedStocks.some((item) => item.symbol === selectedSymbol);
    if (!selectedExists) setSelectedSymbol(enrichedStocks[0].symbol);
  }, [enrichedStocks, selectedSymbol]);

  const selectedStock = useMemo(
    () => enrichedStocks.find((item) => item.symbol === selectedSymbol) || null,
    [enrichedStocks, selectedSymbol]
  );

  const insights = useMemo(() => {
    if (!enrichedStocks.length) {
      return {
        winners: 0,
        losers: 0,
        avgMove: 0,
        notional: 0,
        topGainer: null,
      };
    }

    const winners = enrichedStocks.filter((stock) => stock.changePercent >= 0).length;
    const losers = enrichedStocks.length - winners;
    const avgMove =
      enrichedStocks.reduce((sum, stock) => sum + stock.changePercent, 0) / enrichedStocks.length;
    const notional = enrichedStocks.reduce((sum, stock) => sum + stock.convertedPrice, 0);
    const topGainer = [...enrichedStocks].sort((a, b) => b.changePercent - a.changePercent)[0];

    return { winners, losers, avgMove, notional, topGainer };
  }, [enrichedStocks]);

  const topGainers = useMemo(
    () => [...enrichedStocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3),
    [enrichedStocks]
  );

  const topLosers = useMemo(
    () => [...enrichedStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3),
    [enrichedStocks]
  );

  const mostVolatile = useMemo(
    () => [...enrichedStocks].sort((a, b) => b.volatility - a.volatility).slice(0, 3),
    [enrichedStocks]
  );

  const isLoading = !enrichedStocks.length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[360px] rounded-2xl" />
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-44 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass rounded-2xl p-4 md:p-5"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Stock Command Center</h2>
            <p className="text-sm text-muted">Track leaders, laggards, and chart trend by timeframe.</p>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="stock-currency" className="text-sm text-muted">
              Display currency
            </label>
            <select
              id="stock-currency"
              className="border border-white/15 bg-[#13213f] px-3 py-2 rounded"
              onChange={(e) => setCurrency(e.target.value)}
              value={currency}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="NGN">NGN</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <PriceCard
          name="Market Breadth"
          symbol="UP"
          price={insights.winners}
          changePercent={((insights.winners - insights.losers) / Math.max(enrichedStocks.length, 1)) * 100}
          currency="USD"
        >
          <p className="text-xs text-blue-100/80 mt-2">{insights.winners} up / {insights.losers} down</p>
        </PriceCard>

        <PriceCard
          name="Average Move"
          symbol="24H"
          price={insights.avgMove}
          changePercent={insights.avgMove}
          currency="USD"
        >
          <p className="text-xs text-blue-100/80 mt-2">Across {enrichedStocks.length} tracked stocks</p>
        </PriceCard>

        <PriceCard
          name="Tracked Notional"
          symbol={currency}
          price={insights.notional}
          changePercent={insights.avgMove}
          currency={currency.toLowerCase()}
        >
          <p className="text-xs text-blue-100/80 mt-2">Sum of displayed prices</p>
        </PriceCard>

        <PriceCard
          name="Top Gainer"
          symbol={insights.topGainer?.symbol || '---'}
          price={insights.topGainer?.convertedPrice || 0}
          changePercent={insights.topGainer?.changePercent || 0}
          currency={currency.toLowerCase()}
        >
          <p className="text-xs text-blue-100/80 mt-2">Highest positive momentum</p>
        </PriceCard>
      </section>

      <section className="grid xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 glass rounded-2xl p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h3 className="font-semibold">{selectedSymbol} Trend</h3>
              <p className="text-sm text-muted">Timeframe: {timeframe}</p>
            </div>

            {selectedStock ? (
              <div className="text-right">
                <p className="text-xl font-bold">
                  {selectedStock.convertedPrice.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })} {currency}
                </p>
                <p className={selectedStock.changePercent >= 0 ? 'text-emerald-400 text-sm' : 'text-red-400 text-sm'}>
                  {selectedStock.changePercent >= 0 ? '+' : ''}
                  {selectedStock.changePercent.toFixed(2)}%
                </p>
              </div>
            ) : null}
          </div>

          <StockBarChart symbol={selectedSymbol} points={stockPoints} />
        </div>

        <div className="xl:col-span-2 glass rounded-2xl p-4 md:p-5">
          <h3 className="font-semibold mb-3">Live Watchlist</h3>
          <div className="space-y-2 max-h-[330px] overflow-y-auto pr-1">
            {enrichedStocks.map((stock) => (
              <button
                key={stock.symbol}
                type="button"
                onClick={() => setSelectedSymbol(stock.symbol)}
                className={`w-full text-left rounded-xl border px-3 py-2 transition ${
                  selectedSymbol === stock.symbol
                    ? 'border-blue-400/50 bg-blue-500/15'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{stock.symbol}</p>
                    <p className="text-xs text-muted">Prev close: ${stock.previousClose.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {stock.convertedPrice.toFixed(2)} {currency}
                    </p>
                    <p className={stock.changePercent >= 0 ? 'text-emerald-400 text-xs' : 'text-red-400 text-xs'}>
                      {stock.changePercent >= 0 ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4">
          <h4 className="font-semibold mb-3 text-emerald-300">Top Gainers</h4>
          <div className="space-y-2">
            {topGainers.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                <span className="font-medium">{stock.symbol}</span>
                <span className="text-emerald-400 font-semibold">+{stock.changePercent.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <h4 className="font-semibold mb-3 text-red-300">Top Losers</h4>
          <div className="space-y-2">
            {topLosers.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                <span className="font-medium">{stock.symbol}</span>
                <span className="text-red-400 font-semibold">{stock.changePercent.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <h4 className="font-semibold mb-3 text-amber-300">Most Volatile</h4>
          <div className="space-y-2">
            {mostVolatile.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                <span className="font-medium">{stock.symbol}</span>
                <span className="text-amber-300 font-semibold">{stock.volatility.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StockDashboard;
