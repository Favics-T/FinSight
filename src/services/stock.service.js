import { alphaVantageClient, requestWithParser } from '../lib/fetchClient';
import { parseStockQuote } from '../types/api';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

export function getStockQuote(symbol) {
  return requestWithParser(
    alphaVantageClient.get('', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY,
      },
    }),
    (data) => parseStockQuote((/** @type {any} */ (data))['Global Quote'])
  );
}

export async function getStockQuotes(symbols = []) {
  const output = [];
  for (const symbol of symbols) {
    // Alpha Vantage free tier has strict rate limits, keep sequential.
    const item = await getStockQuote(symbol);
    output.push(item);
  }
  return output;
}

export function searchStock(keywords) {
  return requestWithParser(
    alphaVantageClient.get('', {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords,
        apikey: API_KEY,
      },
    }),
    (data) => (/** @type {any} */ (data)).bestMatches || []
  );
}

export function getStockDaily(symbol) {
  return requestWithParser(
    alphaVantageClient.get('', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: 'compact',
        apikey: API_KEY,
      },
    }),
    (data) => (/** @type {any} */ (data))['Time Series (Daily)'] || {}
  );
}

export function getStockOverview(symbol) {
  return requestWithParser(
    alphaVantageClient.get('', {
      params: {
        function: 'OVERVIEW',
        symbol,
        apikey: API_KEY,
      },
    }),
    (data) => {
      const item = /** @type {any} */ (data) || {};
      return {
        symbol: item.Symbol || symbol,
        name: item.Name || symbol,
        marketCap: Number(item.MarketCapitalization || 0),
        volume: Number(item.SharesOutstanding || 0),
        high24h: Number(item['52WeekHigh'] || 0),
        low24h: Number(item['52WeekLow'] || 0),
      };
    }
  );
}

export function getStockOHLC(symbol, timeframe = '1M') {
  if (timeframe === '1D') {
    return requestWithParser(
      alphaVantageClient.get('', {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol,
          interval: '60min',
          outputsize: 'compact',
          apikey: API_KEY,
        },
      }),
      (data) => {
        const series = /** @type {any} */ (data)?.['Time Series (60min)'] || {};
        return Object.entries(series)
          .map(([time, values]) => ({
            time: new Date(time).getTime(),
            open: Number(values['1. open']),
            high: Number(values['2. high']),
            low: Number(values['3. low']),
            close: Number(values['4. close']),
            volume: Number(values['5. volume']),
          }))
          .sort((a, b) => a.time - b.time);
      }
    );
  }

  return requestWithParser(
    alphaVantageClient.get('', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: 'compact',
        apikey: API_KEY,
      },
    }),
    (data) => {
      const series = /** @type {any} */ (data)?.['Time Series (Daily)'] || {};
      return Object.entries(series)
        .map(([time, values]) => ({
          time: new Date(time).getTime(),
          open: Number(values['1. open']),
          high: Number(values['2. high']),
          low: Number(values['3. low']),
          close: Number(values['4. close']),
          volume: Number(values['5. volume']),
        }))
        .sort((a, b) => a.time - b.time);
    }
  );
}
