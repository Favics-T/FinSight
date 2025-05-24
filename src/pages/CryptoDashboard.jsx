import React, { useEffect, useState } from 'react';
import { fetchMarketData } from '../services/cryptoAPI';
import CryptoChart from '../charts/CryptoChart';

const CryptoDashboard = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('usd');

  const coinIds = ['bitcoin', 'ethereum', 'solana', 'dogecoin'];

  useEffect(() => {
    fetchMarketData(coinIds)
      .then((response) => setCryptoData(response.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className='flex flex-col overflow-x-hidden'>

      <div>
        <select
        onChange={(e)=> setCurrency(e.target.value)}
        value={currency}
         name="" id="">
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="ngn">NGN</option>
          <option value="gbp">GBP</option>

        </select>
      </div>

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

      <div className=' flex flex-col overflow-x-hidden'>
        <div className='px-20 shadow-lg border border-gray-200 py-20 flex flex-col gap-10'>
          <h1 className='font-bold text-2xl leading-4 text-center'>Crypto Performance</h1>
           <CryptoChart />
        </div>
       
        <div>
           
        </div>
      </div>
    

    </div>

    
  );
};

export default CryptoDashboard;
