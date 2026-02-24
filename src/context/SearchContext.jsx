import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { handleStockSymbolSearch } from "../services/stockAPI";
export const SearchContext = createContext();
import { searchCoins } from "../services/cryptoAPI";

const CACHE_TTL_MS = 60 * 1000;
const MIN_QUERY_LENGTH = 2;

export const SearchProvider = ({ children }) => {
  
  const[searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const cacheRef = useRef(new Map());
  const latestRequestRef = useRef({ stock: 0, crypto: 0 });

  const getCacheKey = useCallback((mode, query) => `${mode}:${query}`, []);

  const getFreshCache = useCallback((mode, query) => {
    const key = getCacheKey(mode, query);
    const cached = cacheRef.current.get(key);

    if (!cached) return null;
    const isExpired = Date.now() - cached.timestamp > CACHE_TTL_MS;
    if (isExpired) {
      cacheRef.current.delete(key);
      return null;
    }
    return cached.results;
  }, [getCacheKey]);

  const setCache = useCallback((mode, query, results) => {
    const key = getCacheKey(mode, query);
    cacheRef.current.set(key, {
      results,
      timestamp: Date.now(),
    });
  }, [getCacheKey]);

  const runSearch = useCallback(async (mode, keyword, requestFn, resultSelector) => {
    const normalizedQuery = keyword.trim().toLowerCase();

    if (normalizedQuery.length < MIN_QUERY_LENGTH) {
      setSearchResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    const cachedResults = getFreshCache(mode, normalizedQuery);
    if (cachedResults) {
      setSearchResults(cachedResults);
      setError(null);
      return;
    }

    const currentRequestId = ++latestRequestRef.current[mode];
    setError(null);
    setLoading(true);

    try {
      const response = await requestFn(keyword);
      if (latestRequestRef.current[mode] !== currentRequestId) return;

      const parsedResults = resultSelector(response);
      setSearchResults(parsedResults);
      setCache(mode, normalizedQuery, parsedResults);
    } catch (error) {
      if (latestRequestRef.current[mode] !== currentRequestId) return;
      setError("We encountered a problem loading your result");
      console.error("Search failed", error);
    } finally {
      if (latestRequestRef.current[mode] === currentRequestId) {
        setLoading(false);
      }
    }
  }, [getFreshCache, setCache]);


  //Stock Search
  const handleStockSearch = useCallback(async (keyword)=>{
    await runSearch(
      "stock",
      keyword,
      handleStockSymbolSearch,
      (response) => response.data.bestMatches || []
    );
  }, [runSearch]);

  //crypto search

  const handleCryptoSearch = useCallback(async(keyword)=>{
    await runSearch(
      "crypto",
      keyword,
      searchCoins,
      (response) => response.data.coins || []
    );
  }, [runSearch]);

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
