import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

const StockDetail = () => {
  const { symbol } = useParams(); // e.g. "AAPL"
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockDetail = async () => {
      try {
        const response = await axios.get(BASE_URL, {
          params: {
            function: 'OVERVIEW',
            symbol,
            apikey: API_KEY,
          },
        });
        setStockData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetail();
  }, [symbol]);

  if (loading) return <p>Loading stock details...</p>;
  if (error) return <p>{error}</p>;

  if (!stockData || Object.keys(stockData).length === 0)
    return <p>No data available for this stock.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{stockData.Name} ({stockData.Symbol})</h2>
      <p className="mt-2">{stockData.Description}</p>
      <p className="mt-4"><strong>Market Cap:</strong> ${parseInt(stockData.MarketCapitalization).toLocaleString()}</p>
      <p><strong>Sector:</strong> {stockData.Sector}</p>
      <p><strong>Industry:</strong> {stockData.Industry}</p>
      <p><strong>Dividend Yield:</strong> {stockData.DividendYield}</p>
      <p><strong>52 Week High:</strong> ${stockData['52WeekHigh']}</p>
      <p><strong>52 Week Low:</strong> ${stockData['52WeekLow']}</p>
      <p><strong>Country:</strong> {stockData.Country}</p>
    </div>
  );
};

export default StockDetail;
