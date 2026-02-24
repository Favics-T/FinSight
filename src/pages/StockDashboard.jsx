import React, { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import DataContext from '../context/DataContext';
import { fetchExchangeRate } from '../services/stockAPI';
import StockBarChart from '../charts/StockBarChart';
import PriceCard from '../components/PriceCard';

const StockDashboard = () => {
  const { stocksData, fetchMultipleStockQuotes } = useContext(DataContext);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currency, setCurrency] = useState('EUR');
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');

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
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
    fetchMultipleStockQuotes(symbols);
  }, [fetchMultipleStockQuotes]);

  const isLoading = !stocksData || Object.keys(stocksData).length === 0;
  const stockEntries = useMemo(() => Object.entries(stocksData || {}), [stocksData]);

  if (isLoading) {
    return <p>Loading stock data...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="glass rounded-2xl p-4 md:p-5">
        <label htmlFor="stock-currency" className="block font-semibold mb-2">
          Convert USD to:
        </label>
        <select
          id="stock-currency"
          className="border border-white/15 bg-[#13213f] px-3 py-2 rounded"
          onChange={(e) => setCurrency(e.target.value)}
          value={currency}
        >
          <option value="EUR">EUR</option>
          <option value="NGN">NGN</option>
          <option value="GBP">GBP</option>
          <option value="USD">USD</option>
        </select>
      </div>

      {!exchangeRate ? (
        <p>Loading exchange rate...</p>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-4 gap-4">
          {stockEntries.map(([symbol, data]) => {
            const priceUSD = parseFloat(data?.['05. price']);
            const changePercent = parseFloat(
              String(data?.['10. change percent'] ?? '').replace('%', '')
            );

            return (
              <button
                key={symbol}
                type="button"
                onClick={() => setSelectedSymbol(symbol)}
                className="text-left"
              >
                <PriceCard
                  name={symbol}
                  symbol="USD"
                  price={priceUSD * exchangeRate}
                  changePercent={changePercent}
                  currency={currency.toLowerCase()}
                  className={selectedSymbol === symbol ? 'ring-2 ring-blue-500' : ''}
                >
                  <p className="text-xs text-blue-100/80 mt-2">
                    USD: {Number.isFinite(priceUSD) ? priceUSD.toFixed(2) : '--'}
                  </p>
                </PriceCard>
              </button>
            );
          })}
        </motion.div>
      )}

      <div className="glass rounded-2xl p-4">
        <h2 className="font-semibold mb-3">Trend: {selectedSymbol}</h2>
        <StockBarChart symbol={selectedSymbol} />
      </div>
    </div>
  );
};

export default StockDashboard;
