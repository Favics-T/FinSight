import React, { Suspense, lazy, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import useAnimatedNumber from '../hooks/useAnimatedNumber';
import useDebouncedTimeframe from '../hooks/useDebouncedTimeframe';
import useAssetDetailData from '../hooks/useAssetDetailData';
import type { AssetInfo, AssetNews, Timeframe } from '../types';

const LazyCandlestickChart = lazy(() => import('../components/CandlestickChartWrapper'));
const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '1Y'];

function formatCurrency(value: number): string {
  return `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

interface MetricCardProps {
  label: string;
  value: string;
  colorClass?: string;
}

function MetricCard({ label, value, colorClass = 'text-white' }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className={`text-lg font-semibold mt-1 ${colorClass}`}>{value}</p>
    </div>
  );
}

export default function AssetDetailPage() {
  const params = useParams<{ id?: string; symbol?: string }>();
  const type = params.id ? 'crypto' : 'stock';
  const assetId = params.id || params.symbol || 'bitcoin';
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const debouncedTimeframe = useDebouncedTimeframe(timeframe, 260);

  const { loading, error, info, candles, news } = useAssetDetailData({
    type,
    assetId,
    timeframe: debouncedTimeframe,
  });

  const animatedPrice = useAnimatedNumber(info?.price || 0);
  const animatedMarketCap = useAnimatedNumber(info?.marketCap || 0, 520);
  const animatedVolume = useAnimatedNumber(info?.volume || 0, 520);
  const animatedHigh = useAnimatedNumber(info?.high24h || 0, 420);
  const animatedLow = useAnimatedNumber(info?.low24h || 0, 420);

  const changeColor = useMemo(() => {
    const value = Number(info?.change24h || 0);
    return value >= 0 ? 'text-emerald-400' : 'text-red-400';
  }, [info?.change24h]);

  if (error) {
    return (
      <div className="space-y-4">
        <Card title="Asset detail unavailable" subtitle={error} action={null}>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Link to="/dashboard">
              <Button variant="ghost">Back to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">{info?.name || assetId}</h1>
          <p className="text-sm text-muted">
            {type.toUpperCase()} - {info?.symbol || assetId.toUpperCase()}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted">Current Price</p>
          {loading ? (
            <Skeleton className="h-8 w-36 ml-auto" />
          ) : (
            <p className="text-3xl font-bold">{formatCurrency(animatedPrice)}</p>
          )}
          {!loading && info ? (
            <p className={`text-sm font-semibold ${changeColor}`}>
              {info.change24h >= 0 ? '+' : ''}
              {info.change24h.toFixed(2)}%
            </p>
          ) : null}
        </div>
      </motion.section>

      <section className="grid xl:grid-cols-5 gap-4">
        <Card
          title="Price Action"
          subtitle="Candlestick + SMA/EMA overlays"
          action={null}
          className="xl:col-span-3"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {TIMEFRAMES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTimeframe(item)}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  timeframe === item
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-blue-100 border border-white/10 hover:bg-white/10'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {loading ? (
            <Skeleton className="h-[420px] w-full rounded-lg" />
          ) : (
            <Suspense fallback={<Skeleton className="h-[420px] w-full rounded-lg" />}>
              <LazyCandlestickChart candles={candles} />
            </Suspense>
          )}
        </Card>

        <Card title="Asset Info" subtitle="Key market metrics" action={null} className="xl:col-span-2">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              <MetricCard label="Market Cap" value={formatCurrency(animatedMarketCap)} />
              <MetricCard label="Volume" value={formatCurrency(animatedVolume)} />
              <MetricCard
                label="24h Change"
                value={`${(info?.change24h || 0).toFixed(2)}%`}
                colorClass={changeColor}
              />
              <MetricCard
                label="High / Low"
                value={`${formatCurrency(animatedHigh)} / ${formatCurrency(animatedLow)}`}
              />
            </div>
          )}
        </Card>
      </section>

      <Card title="Latest News" subtitle="Scrollable market headlines" action={null}>
        <div className="max-h-[320px] overflow-y-auto pr-1 grid md:grid-cols-2 gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-28 rounded-lg" />)
            : news.map((item: AssetNews) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="font-semibold text-sm leading-snug">{item.title}</h3>
                    <span className="text-xs text-muted whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-xs text-muted mb-2">{item.source}</p>
                  <p className="text-sm text-blue-100/90">{item.summary}</p>
                </motion.article>
              ))}
        </div>
      </Card>
    </div>
  );
}
