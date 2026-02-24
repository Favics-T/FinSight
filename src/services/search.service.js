import { searchCrypto } from './crypto.service';
import { searchStock } from './stock.service';

/**
 * @typedef {{ id: string; type: 'stock'|'crypto'; title: string; subtitle: string; symbol: string; href: string; thumb?: string }} GlobalSearchItem
 */

/**
 * @param {string} query
 * @returns {Promise<{ stocks: GlobalSearchItem[]; crypto: GlobalSearchItem[] }>}
 */
export async function globalAssetSearch(query) {
  const keyword = String(query || '').trim();
  if (!keyword) return { stocks: [], crypto: [] };

  const [stockRowsRaw, cryptoRowsRaw] = await Promise.all([
    searchStock(keyword),
    searchCrypto(keyword),
  ]);

  const stockRows = (Array.isArray(stockRowsRaw) ? stockRowsRaw : []).slice(0, 6).map((row, idx) => {
    const symbol = String(row['1. symbol'] || '').toUpperCase();
    const name = String(row['2. name'] || symbol || 'Unknown stock');
    return {
      id: `stock-${symbol}-${idx}`,
      type: 'stock',
      title: name,
      subtitle: 'Stock',
      symbol,
      href: `/stock/${symbol}`,
    };
  });

  const cryptoRows = (Array.isArray(cryptoRowsRaw) ? cryptoRowsRaw : []).slice(0, 6).map((row) => {
    const id = String(row.id || '');
    const symbol = String(row.symbol || '').toUpperCase();
    const name = String(row.name || id || 'Unknown crypto');
    return {
      id: `crypto-${id}`,
      type: 'crypto',
      title: name,
      subtitle: 'Crypto',
      symbol,
      href: `/crypto/${id}`,
      thumb: row.thumb,
    };
  });

  return {
    stocks: stockRows,
    crypto: cryptoRows,
  };
}
