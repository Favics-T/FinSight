import React, { useEffect, useState } from 'react';
import { fetchMarketData } from '../services/cryptoAPI';

const CryptoDashboard = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [error, setError] = useState(null);

  const coinIds = ['bitcoin', 'ethereum', 'solana', 'dogecoin'];

  useEffect(() => {
    fetchMarketData(coinIds)
      .then((response) => setCryptoData(response.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {cryptoData.map((coin) => (
        <div key={coin.id} className="p-4 border rounded shadow hover:shadow-lg transition-all">
          <h2 className="font-bold text-lg">{coin.name} ({coin.symbol.toUpperCase()})</h2>
          <img src={coin.image} alt={coin.name} className="w-10 h-10 my-2" />
          <p>Price: ${coin.current_price.toLocaleString()}</p>
          <p>24h Change: {coin.price_change_percentage_24h.toFixed(2)}%</p>
          <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
          <p>24h Volume: ${coin.total_volume.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CryptoDashboard;
