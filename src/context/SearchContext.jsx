import { createContext, useContext, useState } from "react";
import { handleStockSymbolSearch } from "../services/stockAPI";
const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  
  const[searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading,setLoading] = useState(false);

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

  return (
    <SearchContext.Provider value={{ 
                                      searchResults, setSearchResults,handleStockSearch,
                                      error, setError,loading
       
                                        }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext
