import React, { useContext, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { useSearch } from "../context/SearchContext";
import { useToggle } from '../context/ToggleContext';

const SearchBar = () => {
  const [input, setInput] = useState('');
    const [view, setView] = useState(false);
  const {error,handleCryptoSearch,searchResults,
        handleStockSearch,loading} = useSearch();
  const { mode } = useToggle();
  
  

  
  const handleSearch = () => {
    if (input.trim()) {
      if(mode === 'stock'){
          handleStockSearch(input);
      }
     else{
      handleCryptoSearch(input);
     }
      setView(true); 
    } 
    else {
      setView(false);
    }
  };

  const handleSelect = () => {
  setInput('');
  setView(false);
};

const highlightMatch = (text) => {
  const regex = new RegExp(`(${input})`, 'i');
  return text.replace(regex, '<mark>$1</mark>');
};

  // const handleInputChange = (e) => {
  //   setInput(e.target.value);
  //   if (!view) setView(true); 
  //   searchStock(e.target.value); 
  // };

  return (
    <div className="relative w-full max-w-md">
      
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

    if (value.trim()) {
      if (mode === 'stock') {
        handleStockSearch(value);
      } else {
        handleCryptoSearch(value);
      }
      setView(true);
    } else {
      setView(false);
    }
  }}
  onFocus={() => setView(true)}
  onBlur={() => setTimeout(() => setView(false), 200)}
  placeholder="Search..."
  className="md:w-full w-30 pl-10 pr-4 py-2 border md:border-gray-400 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

      </label>
     
     
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
     {view && searchResults && searchResults.length > 0 && (
  <div className='absolute  border border-gray-300 rounded-md mt-1 md:w-full   max-h-96 overflow-auto z-10 shadow-lg'>
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
        <div  className='p-2 hover:bg-gray-200 cursor-pointer'>
          {result['2. name']} ({result['1. symbol']})
        </div>
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
