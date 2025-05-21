import { createContext, useContext, useState } from "react";
import { handleStockSymbolSearch } from "../services/stockAPI";
export const SearchContext = createContext();
import { searchCoins } from "../services/cryptoAPI";
export const SearchProvider = ({ children }) => {
  
  const[searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading,setLoading] = useState(false);


  //Stock Search
  const handleStockSearch = async (keyword)=>{
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
  }

  //crypto search

  const handleCryptoSearch = async(keyword)=>{
    if(!keyword.trim())
      return;
    setError(null);
    setLoading(true);
    try{
      const response = await searchCoins(keyword);
      setSearchResults(response.data.coins || [])
    }
    catch(err){
      setError("Error loading crypto coins");
      console.error("Crypto search failed", error)
    }
    finally{
      setLoading(false)
    }

  }

  return (
    <SearchContext.Provider value={{ 
                                      searchResults, setSearchResults,handleStockSearch,
                                      error, setError,loading,handleCryptoSearch
       
                                        }}>
      {children}
    </SearchContext.Provider>
  );
};
export const useSearch = () => useContext(SearchContext);
// export default SearchContext
