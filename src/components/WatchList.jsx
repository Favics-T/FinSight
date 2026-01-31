import React from "react";
import { formatCurrency } from "../util/formatCurrency";
import EmptyWatchlist from "./EmptyWatchList";

const Watchlist = ({ coins, currency }) => {
  if (coins.length === 0) {
    return (
      <EmptyWatchlist
        onAdd={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="flex justify-between items-center"
        >
          <div className="flex gap-4 items-center">
            <img
              src={coin.image || "/placeholder.png"}
              alt={coin.name}
              className="h-10 w-10"
            />
            <p className="font-medium">{coin.name}</p>
          </div>

          <div className="flex flex-col items-end">
            <p className="font-bold text-lg">
              {formatCurrency(coin.current_price, currency)}
            </p>
            <p
              className={
                coin.price_change_percentage_24h >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {coin.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Watchlist;
