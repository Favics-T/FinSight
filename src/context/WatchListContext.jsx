import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    const stored = localStorage.getItem('watchlist');
    return stored ? JSON.parse(stored) : [];
  });

  const [coinsData, setCoinsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update localStorage on change
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch coin data when watchlist changes
  useEffect(() => {
    const fetchCoins = async () => {
      if (watchlist.length === 0) {
        setCoinsData([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            ids: watchlist.join(','),
            order: 'market_cap_desc',
            per_page: watchlist.length,
            page: 1,
            sparkline: false,
          },
        });
        setCoinsData(res.data);
      } catch (err) {
        setError('Failed to fetch watchlist data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [watchlist]);

  // Toggle a coin in/out of the watchlist
  const toggleWatchlist = (coinId) => {
    setWatchlist((prev) =>
      prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId]
    );
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlist, toggleWatchlist, coinsData, loading, error }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

// Hook for accessing the context
export const useWatchlist = () => useContext(WatchlistContext);
