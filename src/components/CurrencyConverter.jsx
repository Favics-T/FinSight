import React, { useEffect, useState } from 'react';
import { fetchMarketData } from '../services/cryptoAPI';
import { formatCurrency } from '../util/formatCurrency';

const CurrencyConverter = () => {
  const [inputCoin, setInputCoin] = useState('bitcoin');
  const [currency, setCurrency] = useState('usd');
  const [searchedCoinData, setSearchedCoinData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCoin = async () => {
      if (!inputCoin.trim()) {
        setSearchedCoinData(null);
        return;
      }

      try {
        setError(null);
        const res = await fetchMarketData([inputCoin.toLowerCase()], currency);
        setSearchedCoinData(res.data[0] ?? null);
      } catch {
        setError('Unable to fetch coin data');
        setSearchedCoinData(null);
      }
    };

    loadCoin();
  }, [inputCoin, currency]);

  return (
    <div>
      <div className="shadow-lg px-2 items-center py-8   rounded-lg justify-center
       bg-black text-white gap-8 my-10 flex flex-col ">
        <h1 className="font-bold text-center">Cryptocurrency Converter</h1>

        <div className="flex flex-col items-center    gap-6 mb-6">
          <div className="flex items-center w-full gap-4">
            <input
              id="coin-input"
              type="text"
              value={inputCoin}
              onChange={(e) => setInputCoin(e.target.value)}
              placeholder="bitcoin"
              className="border p-2 rounded w-full text-black"
            />
          </div>

          <div className="flex w-full gap-4 items-center">
            <select
              id="currency-select"
              onChange={(e) => setCurrency(e.target.value)}
              value={currency}
              className="border p-2 w-full rounded text-black"
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="ngn">NGN</option>
              <option value="gbp">GBP</option>
            </select>
          </div>

          <div className="py-2 shadow-lg flex flex-col items-center justify-center px-4 mb-4">
            <h1 className="font-bold">Data Result</h1>
            {error && <p className="text-red-400">{error}</p>}
            {searchedCoinData && (
              <div className="p-2 rounded shadow hover:shadow-lg transition-all mb-6">
                <div className="flex justify-between items-center gap-4">
                  <h2 className="font-bold md:text-sm">
                    {searchedCoinData.name} ({searchedCoinData.symbol.toUpperCase()})
                  </h2>
                  <img
                    src={searchedCoinData.image}
                    alt={searchedCoinData.name}
                    className="w-4 h-4 my-2"
                  />
                </div>

                <p className="font-semibold text-sm">
                  <span className="font-bold text-sm">Price ({currency.toUpperCase()})</span>:{" "}
                  {formatCurrency(searchedCoinData.current_price, currency.toUpperCase())}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CurrencyConverter;
