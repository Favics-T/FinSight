import React from "react";
import { motion } from 'framer-motion';
import { formatCurrency } from "../util/formatCurrency";

const PriceCard = ({
  name,
  symbol,
  image,
  price,
  changePercent,
  currency = "usd",
  className = "",
  children,
}) => {
  const numericPrice = Number(price);
  const numericChange = Number(changePercent);
  const displayCurrency = currency.toUpperCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`p-3 rounded-xl glass shadow-lg border border-white/10 ${className}`}
    >
      <div className="flex justify-between items-center gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {image ? (
            <img src={image} alt={name} className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300" />
          )}
          <p className="font-semibold truncate text-white">
            {name} {symbol ? `(${symbol.toUpperCase()})` : ""}
          </p>
        </div>
      </div>

      <p className="text-blue-100 text-sm mb-1">Price</p>
      <p className="text-xl font-bold text-white">
        {Number.isFinite(numericPrice)
          ? formatCurrency(numericPrice, displayCurrency)
          : "--"}
      </p>
      <p className={`text-sm mt-1 ${numericChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
        {Number.isFinite(numericChange) ? `${numericChange.toFixed(2)}%` : "--"}
      </p>

      {children}
    </motion.article>
  );
};

export default PriceCard;
