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

  // Sync watchlist with localStorage
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch full coin data for coins that are only IDs (e.g., after refresh)
  useEffect(() => {
    const fetchCoins = async () => {
      if (watchlist.length === 0) {
        setCoinsData([]);
        return;
      }

      // Only fetch coins not already in coinsData
      const missingIds = watchlist.filter(
        (id) => !coinsData.some((coin) => coin.id === id)
      );

      if (missingIds.length === 0) return; // no need to fetch

      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              ids: missingIds.join(','),
              order: 'market_cap_desc',
              per_page: missingIds.length,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoinsData((prev) => [...prev, ...res.data]);
      } catch (err) {
        setError('Failed to fetch watchlist data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [watchlist, coinsData]);

  // Toggle a coin in/out of watchlist using full coin object
  const toggleWatchlist = (coin) => {
    if (!coin?.id) return;

    setWatchlist((prev) =>
      prev.includes(coin.id) ? prev.filter((id) => id !== coin.id) : [...prev, coin.id]
    );

    setCoinsData((prev) => {
      if (prev.some((c) => c.id === coin.id)) {
        // Remove coin
        return prev.filter((c) => c.id !== coin.id);
      } else {
        // Add coin
        return [...prev, coin];
      }
    });
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
