import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { handleStockSymbolSearch } from "../services/stockAPI";
export const SearchContext = createContext();
import { searchCoins } from "../services/cryptoAPI";
export const SearchProvider = ({ children }) => {
  
  const[searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading,setLoading] = useState(false);


  //Stock Search
  const handleStockSearch = useCallback(async (keyword)=>{
    if(!keyword.trim())
      return;
    setError(null);
    setLoading(true);
    try{
      const response = await handleStockSymbolSearch(keyword);
      setSearchResults(response.data.bestMatches || []);
      console.log('Search API response:', response.data);
    }
    catch(error){
      setError("we encountered a problem loading your result")
      console.error('Error Searching for results',error)
    }
    finally{
      setLoading(false)
    }
  }, []);

  //crypto search

  const handleCryptoSearch = useCallback(async(keyword)=>{
    if(!keyword.trim())
      return;
    setError(null);
    setLoading(true);
    try{
      const response = await searchCoins(keyword);
      setSearchResults(response.data.coins || [])
    }
    catch(error){
      setError("Error loading crypto coins");
      console.error("Crypto search failed", error)
    }
    finally{
      setLoading(false)
    }

  }, []);

  const value = useMemo(
    () => ({
      searchResults,
      setSearchResults,
      handleStockSearch,
      error,
      setError,
      loading,
      handleCryptoSearch,
    }),
    [searchResults, handleStockSearch, error, loading, handleCryptoSearch]
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
export const useSearch = () => useContext(SearchContext);
// export default SearchContext
