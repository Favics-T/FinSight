import React from "react";
import { CiStar } from "react-icons/ci";

const EmptyWatchlist = ({ onAdd }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-gray-500">
      <span className="text-4xl"><CiStar /></span>

      <h2 className="font-semibold text-lg text-gray-700">
        Your watchlist is empty
      </h2>

      <p className="text-sm max-w-xs">
        Add cryptocurrencies to track their price movements and performance.
      </p>

      <button
        onClick={onAdd}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Add to Watchlist
      </button>
    </div>
  );
};

export default EmptyWatchlist;
