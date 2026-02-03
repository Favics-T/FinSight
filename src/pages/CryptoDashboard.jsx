import { useEffect, useState } from "react";
import { fetchMarketData } from "../services/cryptoAPI";
import CryptoChart from "../charts/CryptoChart";
import { formatCurrency } from "../util/formatCurrency";
import Button from "../components/Button";
import { IoIosMore } from "react-icons/io";
import { useWatchlist } from "../context/WatchListContext";
import TopPerformingCrypto from "../components/TopPerformingCrypto";
import Watchlist from "../components/WatchList";

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="animate-pulse p-4 border bg-gray-100 rounded shadow flex flex-col gap-4">
    <div className="flex justify-between">
      <div className="h-4 bg-gray-300 rounded w-24"></div>
      <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
    </div>
    <div className="flex flex-col gap-2">
      <div className="h-6 bg-gray-300 rounded w-32"></div>
      <div className="h-4 bg-gray-300 rounded w-16"></div>
    </div>
  </div>
);

const CryptoDashboard = () => {
  const [topCoinsData, setTopCoinsData] = useState([]);
  const [searchedCoinData, setSearchedCoinData] = useState(null);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("usd");
  const [inputCoin, setInputCoin] = useState("");
  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(true);

  const coinIds = ["bitcoin", "ethereum", "solana", "dogecoin"];
  const { coinsData } = useWatchlist();

  useEffect(() => {
    setLoading(true);
    fetchMarketData(coinIds, currency)
      .then((response) => {
        setTopCoinsData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [currency]);

  useEffect(() => {
    if (!inputCoin) {
      setSearchedCoinData(null);
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

  const btnNames = ["Buy", "Sell", "Send", "Exchange"];

  return (
    <div className="flex justify-center items-center flex-col overflow-x-hidden p-4 w-full">
      {loading ? (
        <div className="w-full max-w-6xl grid md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-center font-semibold">{error}</p>
      ) : (
        <div className="flex flex-col p-4 justify-center items-center w-full">
          {/* Default coin list */}
          <div className="shadow hover:shadow-lg bg-whit rounded-xl transition-all px-6 py-6 w-full">
            <div className="grid md:grid-cols-4 gap-4">
              {topCoinsData.map((coin) => (
                <div
                  key={coin.id}
                  className="p-4 border bg-whit border-gray-200 rounded shadow hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col gap-16">
                    <div className="flex justify-between items-center">
                      <h2 className="font-bold text-lg">
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </h2>
                      {coin.image ? (
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-6 h-6"
                        />
                      ) : (
                        <img
                          src="/placeholder.png"
                          alt="crypto"
                          className="w-6 h-6"
                        />
                      )}
                    </div>

                    <div>
                      <div className="flex w-full justify-between">
                        <div>
                          <p className="font-bold text-xl">
                            {formatCurrency(coin.current_price, currency)}
                          </p>
                          <p
                            className={
                              coin.price_change_percentage_24h >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            <span className="text-gray-700 font-semibold pr-1">
                              24h Change:
                            </span>
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </p>
                        </div>

                        <div>
                          <Button
                            className="font-semibold cursor-pointer border-none"
                            onClick={() =>
                              setView(view === coin.id ? null : coin.id)
                            }
                            name={<IoIosMore />}
                          />
                        </div>
                      </div>

                      {view === coin.id && (
                        <div className="border mt-6 flex flex-col">
                          <h1 className="font-extrabold">
                            Market Cap:
                            <span className="font-bold text-gray-500 block">
                              {formatCurrency(coin.market_cap, currency)}
                            </span>
                          </h1>
                          <h2 className="font-extrabold">
                            24h Volume:
                            <span className="font-bold text-gray-600 block">
                              {formatCurrency(coin.total_volume, currency)}
                            </span>
                          </h2>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Section */}
          <div className="my-10 bg-whit w-full">
            <div className="px-4 col-span-2 mt-12 shadow-lg py-4 flex flex-col gap-4">
              <h1 className="font-bold text-2xl leading-4 text-center">
                Crypto Performance
              </h1>
              <CryptoChart />
            </div>
          </div>

          {/* Watchlist & Exchange Section */}
          <div className="grid md:grid-cols-3 gap-12 place-items-center w-full">
            {/* Watchlist */}
            <div className="bg-w md:w-[650px] overflow-y-auto flex-1 scrollbar-thumb-blue-400 s h-96 border w-96 rounded-xl border-blue-300 shadow-lg col-span-2 px-8 py-4 flex flex-col
           ">
              <h1 className="font-bold leading-relaxed">My Crypto WatchList</h1>
              <div className="flex flex-col gap-4">
                
                <Watchlist coins={coinsData} currency={currency}  />

              </div>
            </div>

            {/* Exchange */}
            <div className="border border-blue-300 rounded-lg shadow-lg w-full max-w-sm">
              <div className="flex flex-col rounded-lg justify-center items-center px-4 gap-6 py-4">
                <h1 className="font-bold text-2xl">Exchange Rate</h1>
                <div className="flex gap-4">
                  {btnNames.map((btn, index) => (
                    <Button key={index} name={btn} />
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="bitcoin..."
                  value={inputCoin}
                  onChange={(e) => setInputCoin(e.target.value)}
                  className="border rounded-lg px-2 py-1"
                />

                <div className="flex">
                  <select
                    id="currency-select"
                    onChange={(e) => setCurrency(e.target.value)}
                    value={currency}
                    className="border rounded"
                  >
                    <option value="usd" className="text-black">
                      USD
                    </option>
                    <option value="eur">EUR</option>
                    <option value="ngn">NGN</option>
                    <option value="gbp">GBP</option>
                  </select>

                  <div className="border py-1 rounded px-2">
                    {searchedCoinData && (
                      <div className="flex items-center justify-center gap-2">
                        <h2 className="font-bold md:text-sm">
                          {searchedCoinData.name} (
                          {searchedCoinData.symbol.toUpperCase()}):
                        </h2>
                        <h1>
                          <span>({currency.toUpperCase()})</span>{" "}
                          {searchedCoinData.current_price.toLocaleString()}
                        </h1>
                      </div>
                    )}
                  </div>
                </div>

                <Button name="Proceed to Wallet" />

                <p className="text-center text-blue-600">
                  Note: The final amount could change depending on market
                  conditions.
                </p>
              </div>
            </div>
          </div>

          {/* Market overview */}
          <div>
            <TopPerformingCrypto />
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoDashboard;
