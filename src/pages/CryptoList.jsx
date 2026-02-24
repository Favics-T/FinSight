import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
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

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="glass rounded-2xl p-4 md:p-5 flex justify-between gap-3 items-center">
        <div>
          <h2 className="md:text-2xl text-lg font-bold">Crypto Directory</h2>
          <p className="text-sm text-muted">Browse and pin assets to your watchlist.</p>
        </div>

        <input
          type="text"
          placeholder="Search by name or symbol"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 md:w-[300px] w-[160px] bg-white/5 border border-white/10 rounded-xl"
        />
      </div>

      {loading ? (
        <p>Loading coins...</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCoins.map((coin, index) => (
            <motion.li
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              key={coin.id}
              className="rounded-xl glass border border-white/10 p-3 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                <div>
                  <h1 className="font-semibold">{coin.name} ({coin.symbol.toUpperCase()})</h1>
                  <p className="text-sm text-muted">${coin.current_price.toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={() => toggleWatchlist(coin)}
                className={`px-3 py-2 rounded-lg transition ${
                  watchlist.includes(coin.id)
                    ? 'bg-white/90 text-[#1336c5]'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                }`}
                aria-label={watchlist.includes(coin.id) ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {watchlist.includes(coin.id) ? <CiSquareRemove /> : <IoMdAdd />}
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CryptoList;
