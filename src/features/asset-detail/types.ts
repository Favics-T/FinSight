export type AssetType = 'crypto' | 'stock';
export type Timeframe = '1D' | '1W' | '1M' | '1Y';

export interface OhlcPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AssetInfo {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume: number;
  change24h: number;
  high24h: number;
  low24h: number;
}

export interface AssetNews {
  id: string;
  title: string;
  source: string;
  time: string;
  summary: string;
}

export interface AssetDetailResult {
  loading: boolean;
  error: string | null;
  info: AssetInfo | null;
  candles: OhlcPoint[];
  news: AssetNews[];
}
