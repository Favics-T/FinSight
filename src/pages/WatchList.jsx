import React from 'react';
import { useWatchlist } from '../context/WatchListContext';

const WatchList = () => {
  const { watchlist, coinsData, toggleWatchlist, loading, error } = useWatchlist();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Watchlist</h2>

      {loading && <p>Loading watchlist data...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {coinsData.length === 0 && !loading && <p>No coins in your watchlist.</p>}

      <ul>
        {coinsData.map((coin) => (
          <li key={coin.id} className="mb-3  border border-blue-300 rounded-3xl bg-whte shadow hover:shadow-lg py-4 px-6  flex justify-between items-center">
            <div>
              <div className='flex gap-4 justify-center items-center'>
                <img src={coin.image} alt={coin.name}
                className='w-10 h-10' />
                <strong> <span></span> {coin.name} ({coin.symbol.toUpperCase()})</strong> - ${coin.current_price.toLocaleString()}
              </div>
              
              
              <span> <span className='font-extrabold'>Market Cap:</span>  ${coin.market_cap.toLocaleString()}</span>
            </div>
            <button
              onClick={() => toggleWatchlist(coin.id)}
              className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* <div className="mt-6">
        <button onClick={() => toggleWatchlist('bitcoin')} className="mr-2 px-4 py-2 border rounded">
          Toggle Bitcoin
        </button>
        <button onClick={() => toggleWatchlist('ethereum')} className="px-4 py-2 border rounded">
          Toggle Ethereum
        </button>
      </div> */}
    </div>
  );
};

export default WatchList;
