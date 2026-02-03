import { createContext, useContext, useState, useEffect } from "react";
import { fetchMarketData } from "../services/cryptoAPI";

const CryptoMarketContext = createContext();

export const CryptoMarketProvider = ({ children }) => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const coinIds = ["bitcoin", "ethereum", "solana", "dogecoin"];

  const loadMarketData = async () => {
    //Prevent refetch if data already exists
    if (marketData.length > 0) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetchMarketData(coinIds);
      setMarketData(res.data);
    } catch (err) {
      setError("Failed to load crypto market data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketData();
  }, []);

  return (
    <CryptoMarketContext.Provider
      value={{ marketData, loading, error }}
    >
      {children}
    </CryptoMarketContext.Provider>
  );
};

export const useCryptoMarket = () => useContext(CryptoMarketContext);
