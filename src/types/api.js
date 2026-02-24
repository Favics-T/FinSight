/**
 * @typedef {Object} MarketAsset
 * @property {string} id
 * @property {string} symbol
 * @property {string} name
 * @property {number} currentPrice
 * @property {number} marketCap
 * @property {number} change24h
 */

/**
 * @typedef {Object} StockQuote
 * @property {string} symbol
 * @property {number} price
 * @property {number} change
 * @property {number} changePercent
 */

/**
 * @param {unknown} value
 * @returns {MarketAsset}
 */
export function parseMarketAsset(value) {
  const item = /** @type {Record<string, unknown>} */ (value || {});

  return {
    id: String(item.id || ''),
    symbol: String(item.symbol || ''),
    name: String(item.name || ''),
    currentPrice: Number(item.current_price || 0),
    marketCap: Number(item.market_cap || 0),
    change24h: Number(item.price_change_percentage_24h || 0),
  };
}

/**
 * @param {unknown} value
 * @returns {StockQuote}
 */
export function parseStockQuote(value) {
  const item = /** @type {Record<string, unknown>} */ (value || {});

  return {
    symbol: String(item['01. symbol'] || item.symbol || ''),
    price: Number(item['05. price'] || item.price || 0),
    change: Number(item['09. change'] || item.change || 0),
    changePercent: Number(
      String(item['10. change percent'] || item.changePercent || '0').replace('%', '')
    ),
  };
}
