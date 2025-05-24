import { useEffect, useState } from "react";
import { fetchMarketData } from "../services/cryptoAPI";
import CryptoChart from "../charts/CryptoChart";
import { formatCurrency } from "../util/formatCurrency";

const CryptoDashboard = () => {
  const [topCoinsData, setTopCoinsData] = useState([]);        // Default coins
  const [searchedCoinData, setSearchedCoinData] = useState(null); // User search
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("usd");
  const [inputCoin, setInputCoin] = useState("");

  const coinIds = ["bitcoin", "ethereum", "solana", "dogecoin"];

  // Load default coin list on initial load
  useEffect(() => {
    fetchMarketData(coinIds, currency)
      .then((response) => setTopCoinsData(response.data))
      .catch((err) => setError(err.message));
  }, [currency]);

  // Handle user input search
  useEffect(() => {
    if (!inputCoin) {
      setSearchedCoinData(null); // Clear search result
      return;
    }

    setError(null);
    fetchMarketData([inputCoin.toLowerCase()], currency)
      .then((response) => {
        if (response.data.length === 0) {
          setError("Coin not found");
        } else {
          setSearchedCoinData(response.data[0]);
        }
      })
      .catch((err) => setError(err.message));
  }, [inputCoin, currency]);

  return (
    <div className="flex flex-col overflow-x-hidden p-4">
     
     
     
      {/* Default coin list */}
      <div className="shadow hover:shadow-lg transition-all px-6 py-6">

<h1 className="font-semibold text-lg text-center pb-4">Crypto List</h1>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topCoinsData.map((coin) => (
          <div
            key={coin.id}
            className="p-4 border border-gray-200  rounded shadow hover:shadow-lg transition-all"
          >


            <div className="flex flex-col gap-16">

<div className="flex justify-between items-center">
<h2 className="font-bold text-lg">
              {coin.name} ({coin.symbol.toUpperCase()})
            </h2>
            <img src={coin.image} alt={coin.name} className="w-6 h-6 " />
            </div>


 <div className="">

<div className=" flex w-full justify-between">
<div className="">
    
                {/* <p>Price: {coin.current_price.toLocaleString()}</p> */}
            {/* i want to use the formatcurrency from my util folder */}
            <p className="font-bold text-xl"> {formatCurrency(coin.current_price, currency)} </p>
            <p className={coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
  <span className="text-black font-semibold pr-1">24h Change:</span> {coin.price_change_percentage_24h.toFixed(2)}%
</p>

  </div>

<div className="">
   <p><span className="font-semibold">Market Cap:</span> {formatCurrency(coin.market_cap, currency)}</p>
<p> <span className="font-semibold">24h Volume:</span> {formatCurrency(coin.total_volume, currency)}</p>
</div>
</div>
  

  


            
            {/* <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
            <p>24h Volume: ${coin.total_volume.toLocaleString()}</p> */}
           
           
           
            </div>


            </div>
            

           
            
            
          
          </div>
        ))}
      </div>
      </div>
      
     
      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

     

     




         {/* Coin input + currency dropdown */}
      <div className="shadow-lg px-10 gap-8 my-10 flex flex-col ">
        <h1 className="font-bold text-center">Cryptocurrency Converter</h1>

        <div className="flex flex-col items-center   sm:flex-row gap-6 mb-6">
        
        <div className="flex items-center gap-4">
          <h1></h1>
          <label htmlFor="coin-input" className=" font-semibold mb-1">
            Enter cryptocurrency (ID):
          </label>
          <input
            id="coin-input"
            type="text"
            value={inputCoin}
            onChange={(e) => setInputCoin(e.target.value.trim())}
            placeholder="Bitcoin.."
            className="border p-2 rounded w- max-w-xs"
          />
        </div>

        <div className="flex gap-4 items-center">
          <label htmlFor="currency-select" className=" font-semibold mb-1">
            Select currency:
          </label>
          <select
            id="currency-select"
            onChange={(e) => setCurrency(e.target.value)}
            value={currency}
            className="border p-2 rounded"
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




      {/* Chart Section */}
      <div className="px-20 mt-12 shadow-lg border border-gray-200 py-20 flex flex-col gap-10">
        <h1 className="font-bold text-2xl leading-4 text-center">
          Crypto Performance
        </h1>
        <CryptoChart />
      </div>
    </div>
  );
};

export default CryptoDashboard;
