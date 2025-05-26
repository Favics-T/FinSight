import React from 'react'

const CurrencyConverter = () => {
  return (
    <div>
      saved <code>

      </code>



      {/* Coin input + currency dropdown */}
      <div className="shadow-lg px-2 items-center py-8   rounded-lg justify-center
       bg-black text-white gap-8 my-10 flex flex-col ">
        
        <h1 className="font-bold text-center">Cryptocurrency Converter</h1>

        <div className="flex flex-col items-center    gap-6 mb-6">
        
        <div className="flex items-center w-full gap-4">
          <h1></h1>
          {/* <label htmlFor="coin-input" className=" font-semibold mb-1">
            Enter cryptocurrency (ID):
          </label> */}
          <input
            id="coin-input"
            type="text"
            value={inputCoin}
            onChange={(e) => setInputCoin(e.target.value.trim())}
            placeholder="Bitcoin.."
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex w-full gap-4 items-center">
          {/* <label htmlFor="currency-select" className=" font-semibold mb-1">
            Select currency:
          </label> */}
          <select
            id="currency-select"
            onChange={(e) => setCurrency(e.target.value)}
            value={currency}
            className="border p-2 w-full rounded"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="ngn">NGN</option>
            <option value="gbp">GBP</option>
          </select>
        </div>


        {/* Searched coin display */}
      <div className="py-2 shadow-lg flex flex-col items-center justify-center    px-4 mb-4 ">
         <h1 className="font-bold "> Data Result</h1>
      {searchedCoinData && (
        <div className="p-2  rounded shadow hover:shadow-lg transition-all  mb-6">
        
        <div className="flex justify-between items-center">
          <h2 className="font-bold md:text-sm">
            {searchedCoinData.name} ({searchedCoinData.symbol.toUpperCase()})
          </h2>
          <img
            src={searchedCoinData.image}
            alt={searchedCoinData.name}
            className="w-4 h-4 my-2"
          />
        </div>
          
          <p className="font-semibold text-sm">
           <span className="font-bold text-sm">Price  ({currency.toUpperCase()}) </span> :{" "}
            {searchedCoinData.current_price.toLocaleString()}
          </p>
          {/* <p>
            24h Change: {searchedCoinData.price_change_percentage_24h.toFixed(2)}%
          </p> */}
          {/* <p>Market Cap: ${searchedCoinData.market_cap.toLocaleString()}</p> */}
          {/* <p>24h Volume: ${searchedCoinData.total_volume.toLocaleString()}</p> */}
        </div>
      )}
      </div>
      </div>

      </div>
    </div>
  )
}

export default CurrencyConverter
