import React from 'react';
import { motion } from 'framer-motion';
import { useWatchlist } from '../context/WatchListContext';

const WatchList = () => {
  const { coinsData, toggleWatchlist, loading, error } = useWatchlist();

  return (
    <div className="p-4">
      <div className="glass rounded-2xl p-5">
        <h2 className="text-2xl font-bold mb-1">My Watchlist</h2>
        <p className="text-sm text-muted mb-6">Assets you are currently tracking.</p>

        {loading && <p>Loading watchlist data...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {coinsData.length === 0 && !loading && <p>No coins in your watchlist.</p>}

        <ul className="space-y-3">
          {coinsData.map((coin, index) => (
            <motion.li
              key={coin.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="border border-white/10 rounded-xl bg-white/5 shadow py-4 px-4 md:px-6 flex justify-between items-center"
            >
              <div>
                <div className="flex gap-4 items-center">
                  <img src={coin.image} alt={coin.name} className="w-10 h-10" />
                  <div>
                    <strong>{coin.name} ({coin.symbol.toUpperCase()})</strong>
                    <p className="text-sm text-muted">${coin.current_price.toLocaleString()}</p>
                  </div>
                </div>

                <span className="text-sm block mt-2">
                  <span className="font-extrabold">Market Cap:</span> ${coin.market_cap.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => toggleWatchlist(coin)}
                className="bg-gradient-to-r from-rose-500 to-red-400 text-white px-3 py-2 rounded-lg"
              >
                Remove
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WatchList;
