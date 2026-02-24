import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearch } from "../context/SearchContext";
import { useToggle } from '../context/ToggleContext';
import { debounce } from '../util/debounce';

const SearchBar = () => {
  const [input, setInput] = useState('');
  const [view, setView] = useState(false);
  const {
    error,
    handleCryptoSearch,
    searchResults,
    handleStockSearch,
    loading,
    setSearchResults,
  } = useSearch();
  const { mode } = useToggle();

  const runSearchByMode = useCallback((value) => {
    if (mode === 'stock') {
      handleStockSearch(value);
    } else {
      handleCryptoSearch(value);
    }
  }, [mode, handleStockSearch, handleCryptoSearch]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (!value.trim() || value.trim().length < 2) {
          setSearchResults([]);
          return;
        }
        runSearchByMode(value);
      }, 450, { maxWait: 1400, trailing: true }),
    [runSearchByMode, setSearchResults]
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleSearch = () => {
    if (input.trim().length >= 2) {
      runSearchByMode(input);
      debouncedSearch.cancel();
      setView(true);
    } else {
      debouncedSearch.cancel();
      setSearchResults([]);
      setView(false);
    }
  };

  const handleSelect = () => {
    setInput('');
    setView(false);
  };

  const highlightMatch = (text) => {
    if (!input.trim()) return text;
    const escaped = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'ig');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <div className="relative w-full max-w-md text-white">
      <label className="relative block">
        <span
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 cursor-pointer"
          onClick={handleSearch}
        >
          <CiSearch className="text-xl" />
        </span>

        <input
          type="text"
          value={input}
          onChange={(e) => {
            const value = e.target.value;
            setInput(value);
            setView(value.trim().length >= 2);
            debouncedSearch(value);
          }}
          onFocus={() => setView(input.trim().length >= 2)}
          onBlur={() => setTimeout(() => setView(false), 180)}
          placeholder={mode === 'stock' ? 'Search stocks...' : 'Search crypto...'}
          className="md:w-full w-36 pl-10 pr-4 py-2 border border-white/15 bg-white/5 text-white placeholder:text-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {loading && <p className="text-xs text-blue-200 mt-2">Loading...</p>}
      {error && <p className="text-xs text-red-300 mt-2">{error}</p>}

      <AnimatePresence>
        {view && searchResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute bg-[#0f1e3f] border border-white/10 rounded-xl mt-2 md:w-full max-h-96 overflow-auto z-10 shadow-xl"
          >
            {mode === 'stock'
              ? searchResults.map((result, index) => (
                  <Link
                    onClick={handleSelect}
                    key={`${result['1. symbol']}-${index}`}
                    to={`/stock/${result['1. symbol']}`}
                    className="p-3 hover:bg-white/10 cursor-pointer block"
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(`${result['2. name']} (${result['1. symbol']})`),
                      }}
                    />
                  </Link>
                ))
              : searchResults.map((coin) => (
                  <Link
                    onClick={handleSelect}
                    to={`/crypto/${coin.id}`}
                    key={coin.id}
                    className="p-3 hover:bg-white/10 cursor-pointer flex items-center gap-2"
                  >
                    <img src={coin.thumb} alt={coin.name} className="w-5 h-5" />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(`${coin.name} (${coin.symbol.toUpperCase()})`),
                      }}
                    />
                  </Link>
                ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
