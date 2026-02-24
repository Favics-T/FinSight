import { coinGeckoClient, requestWithParser } from '../lib/fetchClient';
import { parseMarketAsset } from '../types/api';

const defaultParser = (data) => {
  const list = Array.isArray(data) ? data : [];
  return list.map(parseMarketAsset);
};

export function getCryptoMarkets({ currency = 'usd', ids = [], perPage = 8 } = {}) {
  return requestWithParser(
    coinGeckoClient.get('/coins/markets', {
      params: {
        vs_currency: currency,
        ids: ids.length ? ids.join(',') : undefined,
        order: 'market_cap_desc',
        per_page: perPage,
        page: 1,
        sparkline: false,
      },
    }),
    defaultParser
  );
}

export function getCryptoChart(coinId = 'bitcoin', days = 7, currency = 'usd') {
  return requestWithParser(
    coinGeckoClient.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: currency,
        days,
      },
    }),
    (data) => /** @type {{prices: Array<[number, number]>}} */ (data)
  );
}

export function searchCrypto(query) {
  return requestWithParser(
    coinGeckoClient.get('/search', { params: { query } }),
    (data) => /** @type {{coins: Array<Record<string, unknown>>}} */ (data).coins || []
  );
}
