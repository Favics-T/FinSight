// src/components/CryptoList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useWatchlist } from '../context/WatchListContext';
import { IoMdAdd } from "react-icons/io";
import { CiSquareRemove } from "react-icons/ci";



const CryptoList = () => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const { watchlist, toggleWatchlist } = useWatchlist();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        });
        setCoins(res.data);
      } catch (error) {
        console.error('Failed to fetch coins', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  // Filter coins based on search input
  const filteredCoins = coins.filter(
    coin =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-10">
      <div 
      className='flex justify-between py-4'>
        {/* subheader */}
        <h2 className="md:text-2xl text-sm font-bold ">
          Crypto Coins</h2>

      {/* input */}
       <input
        type="text"
        placeholder="Search coin by name or symbol..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className=" p-2 md:w-[300px] w-[150px] shadow hover:shadow-lg border rounded-xl"
      />

      </div>

      
      

     

      {loading ? (
        <p>Loading coins...</p>
      ) : (
        <ul>
          {filteredCoins.map((coin) => (
            <li
              key={coin.id}
              className="mb-3 bg-blue-950 rounded-lg shadow-lg hover:shadow-lg p-2  flex justify-between items-center"
            >
              <div>
                <h1>{coin.name} ({coin.symbol.toUpperCase()})</h1> - ${coin.current_price.toLocaleString()}
              </div>
              <button
                onClick={() => toggleWatchlist(coin.id)}
                className={`px-3 py-1 rounded  ${
                  watchlist.includes(coin.id) ? 'bg-white text-[#1336c5]' : 'bg-[#1336c5]'
                }`}
              >
                {watchlist.includes(coin.id) ? <CiSquareRemove /> : <IoMdAdd />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CryptoList;
