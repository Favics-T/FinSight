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
    // eslint-disable-next-line no-await-in-loop
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
