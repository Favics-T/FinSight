import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchTopCryptos } from '../services/cryptoAPI';
import PriceCard from './PriceCard';

const TopPerformingCrypto = ({ title = "Top Performing Cryptocurrencies (24h)", limit = 8 }) => {
  const [topCryptos, setTopCryptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTopCryptos();
        setTopCryptos(data.slice(0, limit));
      } catch (err) {
        setError("Failed to fetch top cryptos");
        console.error("Error fetching top cryptos", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [limit]);

  if (loading) return <p>Loading market data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 p-4 rounded-2xl glass w-full mx-auto mt-6"
    >
      <h2 className="text-xl font-bold text-center">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {topCryptos.map((coin) => (
          <PriceCard
            key={coin.id}
            name={coin.name}
            symbol={coin.symbol}
            image={coin.image}
            price={coin.current_price}
            changePercent={coin.price_change_percentage_24h}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default TopPerformingCrypto;
