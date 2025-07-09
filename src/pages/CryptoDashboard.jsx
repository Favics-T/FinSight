import { useEffect, useState } from "react";
import { fetchMarketData } from "../services/cryptoAPI";
import CryptoChart from "../charts/CryptoChart";
import { formatCurrency } from "../util/formatCurrency";
import Button from "../components/Button";
import { IoIosMore } from "react-icons/io";
import { useWatchlist } from "../context/WatchListContext";
import TopPerformingCrypto from "../components/TopPerformingCrypto";

const CryptoDashboard = () => {
  const [topCoinsData, setTopCoinsData] = useState([]);        // Default coins
  const [searchedCoinData, setSearchedCoinData] = useState(null); // User search
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("usd");
  const [inputCoin, setInputCoin] = useState("");
  const [view, setView] = useState(null);

  const coinIds = ["bitcoin", "ethereum", "solana", "dogecoin"];
  const {coinsData}= useWatchlist();
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


  const btnNames =['Buy', 'Sell','Send','Exchange'];
  return (
    <div className="flex justify-center items-center flex-col overflow-x-hidden p-4">
      <div>

        {
        topCoinsData.length > 0 && coinsData.length > 0 
        ?(<div className="flex flex-col p-4 justify-center items-center overflow-x- ">
          
            {/* Default coin list */}
      <div className="shadow hover:shadow-lg bg-whie rounded-xl transition-all px-6 py-6">

{/* <h1 className="font-semibold text-lg text-center pb-4">Crypto List</h1> */}

<div className="grid md:grid-cols-4 gap-4">
        {topCoinsData.map((coin) => (
          <div
            key={coin.id}
            className="p-4 border bg-whit border-gray-200  rounded shadow hover:shadow-lg transition-all"
          >


            <div className="flex flex-col gap-16">

<div className="flex justify-between items-center">
<h2 className="font-bold text-lg">
              {coin.name} ({coin.symbol.toUpperCase()})
            </h2>
            <img src={coin.image} alt={coin.name} className="w-6 h-6 " />
            </div>
 <div className="">

<div className=" flex w-full bg-whit justify-between">
<div className="">
    
                {/* <p>Price: {coin.current_price.toLocaleString()}</p> */}
            {/* i want to use the formatcurrency from my util folder */}
            <p className="font-bold text-xl"> {formatCurrency(coin.current_price, currency)} </p>
            <p className={coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
  <span className="text-white font-semibold pr-1">24h Change:</span> {coin.price_change_percentage_24h.toFixed(2)}%
</p>
  </div>

<div className="">
   <Button
   className="font-semibold text- cursor-pointer border-none"
   onClick={()=> setView(view === coin.id ? null :coin.id)}
   name={<IoIosMore/>}>
    </Button>
    {/* {formatCurrency(coin.market_cap, currency)} */}
{/* <p> <span className="font-semibold">24h Volume:</span>  */}
{/* {formatCurrency(coin.total_volume, currency)} */}
{/* </p> */}


  

</div>
</div>
  

  {
  view === coin.id && (
    <div className=" borde mt-6  flex flex-col">
      <h1 className="font-extrabold">Market Cap: 
        <span className="font-bold text-gray-500 block">
        {formatCurrency(coin.market_cap, currency)}
        </span>
        </h1>
      <h2 className="font-extrabold">
        24h Volume: 
       <span className="font-bold text-gray-600 block"> {formatCurrency(coin.total_volume, currency)}
       </span>
       </h2>
    </div>
  )
}
         
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

          {/* chart  */}
   <div className="my-10 bg-whie">
            
        {/* Chart Section  */}
      <div className="px-4 col-span-2 mt-12 shadow-lg  py-4 flex flex-col gap-4">
        <h1 className="font-bold text-2xl leading-4 text-center">
          Crypto Performance
        </h1>
        <CryptoChart />
      </div>
      
       

   
   </div>

{/* tracked market and conversion */}
<div>
  <div className="grid md:grid-cols-3 gap-12 place-items-center">

    <div className=" bg-whie md:w-[650px] w-96
     justify-center  rounded-xl shadow-lg col-span-2 px-8 py-4 gap-4 flex flex-col">
      <h1 className="font-bold leading-relaxed">
        My Crypto WatchList
      </h1>
      {/* watchlist section starts here */}
      <div className="flex flex-col  gap-4">
        {
          coinsData.map((watchlist)=>(
            <ul key={watchlist.id}
            className="flex  justify-between">
                <div className="flex gap-4">
                  <img src={watchlist.image} alt="coin image"  
                  className="h-10 w-10" />
                  <ul className="flex">
                    <li className="">{watchlist.name} </li>
                  </ul>
                  
                </div>

                <div className="flex flex-col items-center justify-center">
                   <p className="font-bold text-xl"> {formatCurrency(watchlist.current_price, currency)} </p>
            <p className={watchlist.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
  <span className="text-black font-semibold pr-1"></span> {watchlist.price_change_percentage_24h.toFixed(2)}%
</p>
                </div>
                
              </ul>
          ))
        }
      </div>
    </div>
   
    <div className="bg-whit border border-blue-300 rounded-lg shadow-lg">
       <div className=" flex flex-col rounded-lg justify-center items-center px-4 gap-6 py-2  shadow-lg">
      
      <h1 className="font-bold text-2xl ">Exchange Rate</h1>
          <div className="flex gap-4">
             {
        btnNames.map((btn,index)=>(
          <Button key={index} name={btn}/>
        ))
       }
          </div>

        <input type="text" 
        placeholder="bitcoin..."
        value={inputCoin}
        onChange={(e)=> setInputCoin(e.target.value)}
        className="border rounded-lg px-2 py-1 "/>

        <div className="flex">
          
          <select
            id="currency-select"
            onChange={(e) => setCurrency(e.target.value)}
            value={currency}
            className="border  rounded "
          >
            <option value="usd" className="text-black">USD</option>
            <option value="eur">EUR</option>
            <option value="ngn">NGN</option>
            <option value="gbp">GBP</option>
          </select>
          {/* result */}
          <div className="border py-1 rounded px-2">
            {
              searchedCoinData &&(
                <div className="flex items-center justify-center gap-2">
                   <h2 className="font-bold md:text-sm">
            {searchedCoinData.name} ({searchedCoinData.symbol.toUpperCase()}):
          </h2>
          {/* <span className="font-bold text-sm">  ({currency.toUpperCase()}) </span> :{" "} */}
                 <h1> <span>({currency.toUpperCase()})</span> {searchedCoinData.current_price.toLocaleString()}</h1> 
                </div>
              )
            }
          </div>

        </div>
       

        <Button name="Proceed to Wallet"/>

        <p className="text-center text-blue-600">note: The final amount amout could change depending on the market condition</p>

      </div>
    </div>

  </div>

</div>

{/* market overview of top performing cryptos */}
<div>
  <TopPerformingCrypto />
</div>
          
          </div>):
          (<div>
            <p>Crypto DashBoard Loading.......</p>
            </div>)
      }

      </div>
      


       
         



    </div>
  );
};

export default CryptoDashboard;
