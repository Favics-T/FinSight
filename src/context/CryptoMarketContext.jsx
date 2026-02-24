import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchMarketData } from "../services/cryptoAPI";

const CryptoMarketContext = createContext();
const COIN_IDS = ["bitcoin", "ethereum", "solana", "dogecoin"];

export const CryptoMarketProvider = ({ children }) => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMarketData = useCallback(async () => {
    //Prevent refetch if data already exists
    if (marketData.length > 0) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetchMarketData(COIN_IDS);
      setMarketData(res.data);
    } catch (error) {
      setError("Failed to load crypto market data");
      console.error("Failed to load crypto market data", error);
    } finally {
      setLoading(false);
    }
  }, [marketData.length]);

  useEffect(() => {
    loadMarketData();
  }, [loadMarketData]);

  return (
    <CryptoMarketContext.Provider
      value={{ marketData, loading, error }}>
        
              {children}
    </CryptoMarketContext.Provider>
  );
};

export const useCryptoMarket = () => useContext(CryptoMarketContext);
