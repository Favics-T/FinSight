import React from "react";
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
    <article
      className={`p-3 rounded-lg shadow border border-blue-500 hover:shadow-lg transition ${className}`}
    >
      <div className="flex justify-between items-center gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {image ? (
            <img src={image} alt={name} className="w-5 h-5" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-300" />
          )}
          <p className="font-semibold truncate">
            {name} {symbol ? `(${symbol.toUpperCase()})` : ""}
          </p>
        </div>
      </div>

      <p className="text-gray-700">
        Price:{" "}
        {Number.isFinite(numericPrice)
          ? formatCurrency(numericPrice, displayCurrency)
          : "--"}
      </p>
      <p className={numericChange >= 0 ? "text-green-600" : "text-red-600"}>
        24h: {Number.isFinite(numericChange) ? `${numericChange.toFixed(2)}%` : "--"}
      </p>

      {children}
    </article>
  );
};

export default PriceCard;
