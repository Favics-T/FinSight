import React from "react";
import { CiStar } from "react-icons/ci";

const EmptyWatchlist = ({ onAdd }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-blue-100/70 py-8">
      <span className="text-4xl text-blue-300"><CiStar /></span>

      <h2 className="font-semibold text-lg text-white">
        Your watchlist is empty
      </h2>

      <p className="text-sm max-w-xs text-muted">
        Add cryptocurrencies to track their price movements and performance.
      </p>

      <button
        onClick={onAdd}
        className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:brightness-110 transition"
      >
        Add to Watchlist
      </button>
    </div>
  );
};

export default EmptyWatchlist;
