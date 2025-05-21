import React, { useContext, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import DataContext from '../context/DataContext';
import {handleStockSearch} from '../context/SearchContext'

const SearchBar = () => {
  const [input, setInput] = useState('');
  const { searchStock, searchResults } = useContext(DataContext);
  const [view, setView] = useState(false);


  console.log("Input value:", input);
console.log("Search results:", searchResults);

  
  const handleSearch = () => {
    if (input.trim()) {
      searchStock(input);
      setView(true); 
    } else {
      setView(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!view) setView(true); 
    searchStock(e.target.value); 
  };

  return (
    <div className="relative w-full max-w-md">
      <label className="relative block">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" onClick={handleSearch}>
          <CiSearch />
        </span>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={() => setView(true)} 
          onBlur={() => setTimeout(() => setView(false), 200)} 
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
      </label>

      {view && searchResults && searchResults.length > 0 && (
        <div className='absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-96 overflow-auto z-10 shadow-lg'>
          {searchResults.map((result, index) => (
            <div key={index} className='p-2 hover:bg-gray-200 cursor-pointer'>
              {result} {/* Adjust depending on your searchResults structure */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
