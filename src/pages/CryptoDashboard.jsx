import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fetchMarketData } from "../services/cryptoAPI";
import CryptoChart from "../charts/CryptoChart";
import { formatCurrency } from "../util/formatCurrency";
import Button from "../components/Button";
import { IoIosMore } from "react-icons/io";
import { useWatchlist } from "../context/WatchListContext";
import TopPerformingCrypto from "../components/TopPerformingCrypto";
import Watchlist from "../components/WatchList";
import PriceCard from "../components/PriceCard";
import { useTimeframe } from "../context/TimeframeContext";

const COIN_IDS = ["bitcoin", "ethereum", "solana", "dogecoin"];

const SkeletonCard = () => (
  <div className="animate-pulse p-4 border border-white/10 bg-white/5 rounded-xl flex flex-col gap-4 h-36" />
);

const CryptoDashboard = () => {
  const [topCoinsData, setTopCoinsData] = useState([]);
  const [searchedCoinData, setSearchedCoinData] = useState(null);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("usd");
  const [inputCoin, setInputCoin] = useState("");
  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(true);
  const { coinsData } = useWatchlist();
  const { timeframe, cryptoDays } = useTimeframe();

  useEffect(() => {
    setLoading(true);
    fetchMarketData(COIN_IDS, currency)
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
    if (!inputCoin.trim()) {
      setSearchedCoinData(null);
      return;
    }

    setError(null);
    fetchMarketData([inputCoin.toLowerCase()], currency)
      .then((response) => {
        if (response.data.length === 0) {
          setError("Coin not found");
          return;
        }
        setSearchedCoinData(response.data[0]);
      })
      .catch((err) => setError(err.message));
  }, [inputCoin, currency]);

  const summaryStats = useMemo(() => {
    if (!topCoinsData.length) return [];

    const totalCap = topCoinsData.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
    const avgChange =
      topCoinsData.reduce((sum, coin) => sum + (coin.price_change_percentage_24h || 0), 0) /
      topCoinsData.length;

    return [
      { label: "Tracked Assets", value: `${topCoinsData.length}` },
      { label: "Combined Market Cap", value: formatCurrency(totalCap, currency.toUpperCase()) },
      { label: "Avg 24h Change", value: `${avgChange.toFixed(2)}%` },
    ];
  }, [topCoinsData, currency]);

  const btnNames = ["Buy", "Sell", "Send", "Exchange"];

  return (
    <div className="flex justify-center items-center flex-col overflow-x-hidden p-2 md:p-4 w-full gap-6">
      {loading ? (
        <div className="w-full max-w-6xl grid md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-400 text-center font-semibold">{error}</p>
      ) : (
        <>
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {summaryStats.map((item) => (
              <div key={item.label} className="glass rounded-xl p-4 border border-white/10">
                <p className="text-sm text-muted">{item.label}</p>
                <p className="text-2xl font-bold mt-1">{item.value}</p>
              </div>
            ))}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="w-full glass rounded-2xl p-4 md:p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Market Snapshot</h2>
              <p className="text-sm text-muted">Live prices by selected quote currency</p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {topCoinsData.map((coin) => (
                <PriceCard
                  key={coin.id}
                  name={coin.name}
                  symbol={coin.symbol}
                  image={coin.image}
                  price={coin.current_price}
                  changePercent={coin.price_change_percentage_24h}
                  currency={currency}
                >
                  <Button
                    className="mt-3 text-xs"
                    onClick={() => setView(view === coin.id ? null : coin.id)}
                    name={<IoIosMore />}
                  />

                  {view === coin.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 text-xs text-blue-100/80"
                    >
                      <p>Market Cap: {formatCurrency(coin.market_cap, currency.toUpperCase())}</p>
                      <p>24h Volume: {formatCurrency(coin.total_volume, currency.toUpperCase())}</p>
                    </motion.div>
                  )}
                </PriceCard>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="w-full glass rounded-2xl p-4 md:p-6"
          >
            <h1 className="font-bold text-2xl text-center mb-1">Crypto Performance</h1>
            <p className="text-sm text-muted text-center mb-5">
              Timeframe: {timeframe}
            </p>
            <CryptoChart coinId={topCoinsData[0]?.id || "bitcoin"} days={cryptoDays} />
          </motion.section>

          <section className="grid md:grid-cols-3 gap-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass h-96 rounded-2xl border border-white/10 col-span-2 px-6 py-4 overflow-y-auto"
            >
              <h1 className="font-bold leading-relaxed mb-4">My Crypto Watchlist</h1>
              <Watchlist coins={coinsData} currency={currency} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl border border-white/10 w-full p-5"
            >
              <div className="flex flex-col rounded-lg gap-6">
                <h1 className="font-bold text-xl">Quick Convert</h1>

                <div className="flex gap-2 flex-wrap">
                  {btnNames.map((btn) => (
                    <Button key={btn} name={btn} className="text-sm" />
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="bitcoin..."
                  value={inputCoin}
                  onChange={(e) => setInputCoin(e.target.value)}
                  className="border border-white/15 bg-white/5 rounded-lg px-3 py-2"
                />

                <div className="flex flex-col gap-3">
                  <select
                    id="currency-select"
                    onChange={(e) => setCurrency(e.target.value)}
                    value={currency}
                    className="border border-white/15 bg-[#13213f] rounded px-2 py-2"
                  >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="ngn">NGN</option>
                    <option value="gbp">GBP</option>
                  </select>

                  <div className="border border-white/15 py-2 rounded px-3 min-h-12">
                    {searchedCoinData ? (
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <h2>
                          {searchedCoinData.name} ({searchedCoinData.symbol.toUpperCase()})
                        </h2>
                        <h1>
                          {formatCurrency(searchedCoinData.current_price, currency.toUpperCase())}
                        </h1>
                      </div>
                    ) : (
                      <p className="text-sm text-muted">Type a coin id to preview conversion.</p>
                    )}
                  </div>
                </div>

                <Button name="Proceed to Wallet" className="font-semibold" />

                <p className="text-xs text-muted">
                  Final amounts may change based on market volatility and slippage.
                </p>
              </div>
            </motion.div>
          </section>

          <div className="w-full">
            <TopPerformingCrypto />
          </div>
        </>
      )}
    </div>
  );
};

export default CryptoDashboard;
