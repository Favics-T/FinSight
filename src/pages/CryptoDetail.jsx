import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CryptoDetail = () => {
  const { id } = useParams(); 
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
        setCoin(res.data);
      } catch (err) {
        setError('Failed to load coin data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [id]);

  if (loading) return <p>Loading coin data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{coin.name} ({coin.symbol.toUpperCase()})</h2>
      <img src={coin.image.large} alt={coin.name} className="w-16 my-2" />
      <p dangerouslySetInnerHTML={{ __html: coin.description.en.split('. ')[0] }} />
      <p>Current Price: ${coin.market_data.current_price.usd.toLocaleString()}</p>
      <p>Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}</p>
      <p>24h Change: {coin.market_data.price_change_percentage_24h.toFixed(2)}%</p>
      <p>Homepage: <a href={coin.links.homepage[0]} className="text-blue-600 underline">{coin.links.homepage[0]}</a></p>
    </div>
  );
};

export default CryptoDetail;
