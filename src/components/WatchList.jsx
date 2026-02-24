import React from "react";
import { motion } from 'framer-motion';
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
    <div className="flex flex-col gap-3">
      {coins.map((coin, index) => (
        <motion.div
          key={coin.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
          className="flex justify-between items-center rounded-xl border border-white/10 bg-white/5 p-3"
        >
          <div className="flex gap-3 items-center">
            <img
              src={coin.image || "/placeholder.png"}
              alt={coin.name}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-medium">{coin.name}</p>
              <p className="text-xs text-muted">{coin.symbol.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <p className="font-bold text-lg">
              {formatCurrency(coin.current_price, currency.toUpperCase())}
            </p>
            <p
              className={
                coin.price_change_percentage_24h >= 0
                  ? "text-emerald-400 text-sm"
                  : "text-rose-400 text-sm"
              }
            >
              {coin.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Watchlist;
