import { createContext, useContext, useState } from "react";
import { getStockQuote, getStockDaily, handleStockSymbolSearch } from "../services/stockAPI";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [stockData, setStockData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [mode,setMode] = useState('crypto')
  const [assetData, setAssetData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stocksData, setStocksData] = useState([]);
  
 

      const fetchStockQuote = async (symbol) => {
    try {
      const response = await getStockQuote(symbol);
      setStockData(response.data['Global Quote']);
    } catch (error) {
      console.error('Error fetching stock quote:', error);
    }
  };

  const fetchMultipleStockQuotes = async (symbols)=>{
    try{
      const results = {};

      for(const symbol of symbols){
        const response = await getStockQuote(symbol);
        results[symbol] = response.data['Global Quote']
      }
      setStocksData(results)
    }
    catch(error){
      setError('Error fetching data, turn off your airplane mode')
      console.error('error fetching data')
    }
  }

  const fetchStockDaily = async (symbol) => {
    try {
      const response = await getStockDaily(symbol);
      setDailyData(response.data['Time Series (Daily)']);
    } catch (error) {
      console.error('Error fetching daily stock data:', error);
    }
  };

  const searchStock = async (keyword) => {
    try {
      const response = await handleStockSymbolSearch(keyword);
      setSearchResults(response.data.bestMatches || []);
    } catch (error) {
      console.error('Error searching stock:', error);
      setError('Stock not found')
    }
  };

  return (
    <DataContext.Provider value={{ setStockData,dailyData,
                                 setDailyData, searchResults,fetchMultipleStockQuotes,
                                  setSearchResults, stockData,assetData, 
                                  setAssetData, chartData, setChartData,stocksData,setStocksData, 
                                  loading, setLoading, error, setError,mode,setMode,
                                  fetchStockDaily,fetchStockQuote,searchStock }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
export default DataContext
