import { createContext, useContext, useState } from "react";
import { handleStockSymbolSearch } from "../services/stockAPI";
const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  
  const[searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleStockSearch = async (keyword)=>{
    if(keyword.trim())
      return;
    setError(null);
    try{
      const response = await handleStockSymbolSearch(keyword);
      setSearchResults(response.data.bestMatches || []);
    }
    catch(error){
      setError("we encountered a problem loading your result")
      console.error('Error Searching for results',error)
    }
  }

  return (
    <SearchContext.Provider value={{ 
                                      searchResults, setSearchResults,handleStockSearch,
                                      error, setError
       
                                        }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider
;
