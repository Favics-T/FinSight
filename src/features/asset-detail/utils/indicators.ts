import type { OhlcPoint, Timeframe } from '../types';

export interface IndicatorPoint {
  x: number;
  y: number | null;
}

export function calculateSMA(candles: OhlcPoint[], period = 14): IndicatorPoint[] {
  if (!Array.isArray(candles) || candles.length === 0) return [];

  const output: IndicatorPoint[] = [];
  for (let i = 0; i < candles.length; i += 1) {
    if (i + 1 < period) {
      output.push({ x: candles[i].time, y: null });
      continue;
    }

    let sum = 0;
    for (let j = i - period + 1; j <= i; j += 1) {
      sum += candles[j].close;
    }

    output.push({ x: candles[i].time, y: sum / period });
  }

  return output;
}

export function calculateEMA(candles: OhlcPoint[], period = 14): IndicatorPoint[] {
  if (!Array.isArray(candles) || candles.length === 0) return [];

  const multiplier = 2 / (period + 1);
  const output: IndicatorPoint[] = [];
  let ema = candles[0].close;

  for (let i = 0; i < candles.length; i += 1) {
    const close = candles[i].close;
    if (i === 0) {
      ema = close;
    } else {
      ema = close * multiplier + ema * (1 - multiplier);
    }
    output.push({ x: candles[i].time, y: ema });
  }

  return output;
}

export function filterCandlesByTimeframe(candles: OhlcPoint[], timeframe: Timeframe): OhlcPoint[] {
  const dayMap: Record<Timeframe, number> = { '1D': 1, '1W': 7, '1M': 30, '1Y': 365 };
  const days = dayMap[timeframe] || 30;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return candles.filter((item) => item.time >= cutoff);
}
