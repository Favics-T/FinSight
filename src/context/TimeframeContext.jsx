import { createContext, useContext, useMemo, useState } from "react";

const TimeframeContext = createContext();

const TIMEFRAMES = ["1D", "1W", "1M", "1Y", "All"];

const CRYPTO_DAYS_MAP = {
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "1Y": 365,
  All: "max",
};

const STOCK_POINTS_MAP = {
  "1D": 2,
  "1W": 7,
  "1M": 30,
  "1Y": 100,
  All: "all",
};

export const TimeframeProvider = ({ children }) => {
  const [timeframe, setTimeframe] = useState("1W");

  const value = useMemo(
    () => ({
      timeframe,
      setTimeframe,
      timeframes: TIMEFRAMES,
      cryptoDays: CRYPTO_DAYS_MAP[timeframe],
      stockPoints: STOCK_POINTS_MAP[timeframe],
    }),
    [timeframe]
  );

  return <TimeframeContext.Provider value={value}>{children}</TimeframeContext.Provider>;
};

export const useTimeframe = () => useContext(TimeframeContext);

