import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';
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

  const handleSearch = () => {
    if (input.trim().length >= 2) {
      runSearchByMode(input);
      debouncedSearch.cancel();
      setView(true); 
    } 
    else {
      debouncedSearch.cancel();
      setSearchResults([]);
      setView(false);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (!value.trim() || value.trim().length < 2) {
          setSearchResults([]);
          return;
        }
        runSearchByMode(value);
      }, 500, { maxWait: 1500, trailing: true }),
    [runSearchByMode, setSearchResults]
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

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
    <div className="relative w-full max-w-md text-black">
      
      <label className="relative block">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" onClick={handleSearch}>
          <CiSearch className='text-white'/>
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
  onFocus={() => setView(true)}
  onBlur={() => setTimeout(() => setView(false), 200)}
  placeholder="Search..."
  className="md:w-full w-30 pl-10 pr-4 py-2 border md:border-gray-400 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

      </label>
     
     
      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
     {view && searchResults && searchResults.length > 0 && (
  <div className='absolute bg-white border border-gray-300 rounded-md mt-1 md:w-full max-h-96 overflow-auto z-10 shadow-lg'>
    {mode === 'stock' ? (
      searchResults.map((result, index) => (
        <Link 
        onClick={handleSelect}
        key={index}
        to={`/stock/${result['1. symbol']}`}
        className='p-2 hover:bg-gray-200 cursor-pointer block'
        >
           <span
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(`${result['2. name']} (${result['1. symbol']})`)
                    }}
                  />
        </Link>
      ))
    ) : (
      searchResults.map((coin) => (
        <Link
        onClick={handleSelect}
          to={`/crypto/${coin.id}`}
          key={coin.id}
          className='p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2'
        >
          <img src={coin.thumb} alt={coin.name} className='w-5 h-5' />
          <span
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(`${coin.name} (${coin.symbol.toUpperCase()})`)
                    }}
                  />
          {/* <span>{coin.name} ({coin.symbol.toUpperCase()})</span> */}
        </Link>
      ))
    )}
  </div>
)}

    </div>
  );
};

export default SearchBar;
