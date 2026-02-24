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

export function getCryptoOHLC(coinId = 'bitcoin', days = 7, currency = 'usd') {
  return requestWithParser(
    coinGeckoClient.get(`/coins/${coinId}/ohlc`, {
      params: {
        vs_currency: currency,
        days,
      },
    }),
    (data) => {
      const list = Array.isArray(data) ? data : [];
      return list.map((entry) => ({
        time: entry[0],
        open: Number(entry[1]),
        high: Number(entry[2]),
        low: Number(entry[3]),
        close: Number(entry[4]),
        volume: 0,
      }));
    }
  );
}

export function getCryptoAssetInfo(coinId = 'bitcoin', currency = 'usd') {
  return requestWithParser(
    coinGeckoClient.get('/coins/markets', {
      params: {
        vs_currency: currency,
        ids: coinId,
        order: 'market_cap_desc',
        per_page: 1,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h',
      },
    }),
    (data) => {
      const item = Array.isArray(data) ? data[0] : null;
      if (!item) return null;
      return {
        id: item.id,
        symbol: String(item.symbol || '').toUpperCase(),
        name: item.name,
        price: Number(item.current_price || 0),
        marketCap: Number(item.market_cap || 0),
        volume: Number(item.total_volume || 0),
        change24h: Number(item.price_change_percentage_24h || 0),
        high24h: Number(item.high_24h || 0),
        low24h: Number(item.low_24h || 0),
      };
    }
  );
}

export function searchCrypto(query) {
  return requestWithParser(
    coinGeckoClient.get('/search', { params: { query } }),
    (data) => /** @type {{coins: Array<Record<string, unknown>>}} */ (data).coins || []
  );
}
