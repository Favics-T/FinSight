import React, { useEffect, useState } from 'react';
import { fetchTopCryptos } from '../services/cryptoAPI';

const Market = () => {
  const [topCryptos, setTopCryptos] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchTopCryptos();
        setTopCryptos(data);
      } catch (err) {
        console.error("Error fetching top cryptos", err);
      }
    };
    getData();
  }, []);

  return (
    <div className="bg-whie flex flex-col gap-6 p-4 rounded-xl shadow-md w-full max-w-4x mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Top Performing Cryptocurrencies (24h)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {topCryptos.map(coin => (
          <div key={coin.id} className=" p-3 rounded-lg shadow bg-[#fcfcfc border border-blue-300 hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2">
              <img src={coin.image} alt={coin.name} className="w-5 h-5" />
              <span className="font-semibold">{coin.name}</span>
              <span className="text-gray-400">({coin.symbol.toUpperCase()})</span>
            </div>
            <div className="text-gray-700">Price: ${coin.current_price.toLocaleString()}</div>
            <div className={`font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              24h: {coin.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Market;
