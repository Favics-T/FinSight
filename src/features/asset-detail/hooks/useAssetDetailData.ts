import { useEffect, useMemo, useState } from 'react';
import { getCryptoAssetInfo, getCryptoOHLC } from '../../../services/crypto.service';
import { getStockOHLC, getStockOverview, getStockQuote } from '../../../services/stock.service';
import { filterCandlesByTimeframe } from '../utils/indicators';
import type { AssetDetailResult, AssetInfo, AssetNews, AssetType, OhlcPoint, Timeframe } from '../types';

const dayMap: Record<Timeframe, number> = { '1D': 1, '1W': 7, '1M': 30, '1Y': 365 };

function createNewsFeed(name: string, symbol: string): AssetNews[] {
  const tag = `${name} (${symbol})`;
  return [
    {
      id: `${symbol}-n1`,
      title: `${tag} market sentiment turns positive as momentum improves`,
      source: 'MarketWire',
      time: '2h ago',
      summary: 'Analysts observed improved liquidity and stronger participation from institutional desks.',
    },
    {
      id: `${symbol}-n2`,
      title: `${tag} sees increased derivatives activity`,
      source: 'Trading Journal',
      time: '5h ago',
      summary: 'Open interest and options skew suggest heightened interest in short-term directional trades.',
    },
    {
      id: `${symbol}-n3`,
      title: `${tag} technical levels to watch this week`,
      source: 'Insight Desk',
      time: '9h ago',
      summary: 'Support and resistance clusters are tightening, increasing probability of a volatility breakout.',
    },
    {
      id: `${symbol}-n4`,
      title: `${tag} macro factors creating cross-asset pressure`,
      source: 'Global Markets',
      time: '1d ago',
      summary: 'Rate expectations and currency moves are influencing short-term positioning decisions.',
    },
  ];
}

interface UseAssetDetailDataInput {
  type: AssetType;
  assetId: string;
  timeframe: Timeframe;
}

export function useAssetDetailData({ type, assetId, timeframe }: UseAssetDetailDataInput): AssetDetailResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<AssetInfo | null>(null);
  const [candles, setCandles] = useState<OhlcPoint[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        if (type === 'crypto') {
          const days = dayMap[timeframe] || 30;
          const [assetInfoRaw, ohlcRaw] = await Promise.all([
            getCryptoAssetInfo(assetId, 'usd'),
            getCryptoOHLC(assetId, days, 'usd'),
          ]);

          if (!mounted) return;

          const assetInfo = assetInfoRaw as AssetInfo | null;
          const ohlc = (ohlcRaw as OhlcPoint[]) || [];

          setInfo(assetInfo);
          setCandles(ohlc);
        } else {
          const [overviewRaw, quoteRaw, ohlcRaw] = await Promise.all([
            getStockOverview(assetId),
            getStockQuote(assetId),
            getStockOHLC(assetId, timeframe),
          ]);

          if (!mounted) return;

          const overview = overviewRaw as {
            name?: string;
            marketCap?: number;
            volume?: number;
            high24h?: number;
            low24h?: number;
          };

          const quote = quoteRaw as {
            symbol?: string;
            price?: number;
            changePercent?: number;
          };

          const ohlc = (ohlcRaw as OhlcPoint[]) || [];

          setInfo({
            id: assetId,
            symbol: quote.symbol || assetId.toUpperCase(),
            name: overview.name || quote.symbol || assetId.toUpperCase(),
            price: Number(quote.price || 0),
            marketCap: Number(overview.marketCap || 0),
            volume: Number(overview.volume || 0),
            change24h: Number(quote.changePercent || 0),
            high24h: Number(overview.high24h || 0),
            low24h: Number(overview.low24h || 0),
          });
          setCandles(filterCandlesByTimeframe(ohlc, timeframe));
        }
      } catch (requestError) {
        if (!mounted) return;
        const message = requestError instanceof Error ? requestError.message : 'Failed to load asset data';
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [type, assetId, timeframe]);

  const news = useMemo<AssetNews[]>(() => {
    if (!info) return [];
    return createNewsFeed(info.name, info.symbol);
  }, [info]);

  return {
    loading,
    error,
    info,
    candles,
    news,
  };
}

export default useAssetDetailData;
