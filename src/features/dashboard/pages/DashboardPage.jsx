import React, { memo, useEffect, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { CardSkeleton, Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../hooks/useToast';
import SummaryCard from '../components/SummaryCard';
import { useDashboardData } from '../hooks/useDashboardData';

const currency = (value) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const ChangeBadge = memo(function ChangeBadge({ value }) {
  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${
        value >= 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'
      }`}
    >
      {value >= 0 ? '+' : ''}
      {value.toFixed(2)}%
    </span>
  );
});

const WatchlistRow = memo(function WatchlistRow({ item, movement }) {
  const movementClass =
    movement === 'up'
      ? 'bg-emerald-500/12 border-emerald-400/30'
      : movement === 'down'
        ? 'bg-red-500/12 border-red-400/30'
        : 'bg-white/5 border-white/10';

  return (
    <div className={`rounded-lg border px-3 py-2 transition-all duration-500 ${movementClass}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{item.symbol}</p>
          <p className="text-xs text-muted">{item.type}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{currency(item.price)}</p>
          <ChangeBadge value={item.changePercent} />
        </div>
      </div>
    </div>
  );
});

const MarketList = memo(function MarketList({ title, items }) {
  return (
    <Card title={title}>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
          >
            <div>
              <p className="font-medium">{item.symbol}</p>
              <p className="text-xs text-muted">{item.type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm">{currency(item.price)}</p>
              <ChangeBadge value={item.changePercent} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </section>
    <section className="grid xl:grid-cols-5 gap-4">
      <div className="xl:col-span-2 glass rounded-xl p-4 border border-white/10 space-y-3">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
      <div className="xl:col-span-3 grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 border border-white/10 space-y-3">
            <Skeleton className="h-5 w-24" />
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function DashboardPage() {
  const { pushToast } = useToast();
  const {
    loading,
    error,
    lastUpdated,
    portfolio,
    watchlist,
    marketOverview,
    movements,
    refresh,
  } = useDashboardData();
  const lastErrorRef = useRef('');

  useEffect(() => {
    if (!error || lastErrorRef.current === error) return;
    lastErrorRef.current = error;
    pushToast({
      variant: 'error',
      title: 'Market feed warning',
      description: error,
      duration: 2400,
    });
  }, [error, pushToast]);

  return (
    <div className="space-y-6">
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <SummaryCard title="Total Balance" value={portfolio.totalBalance} formatter={currency} />
            <SummaryCard
              title="24h Change"
              value={portfolio.dayChangeValue}
              formatter={currency}
              trend={portfolio.dayChangePercent}
            />
            <SummaryCard
              title="Total P/L"
              value={portfolio.totalPL}
              formatter={currency}
              trend={portfolio.totalBalance ? (portfolio.totalPL / portfolio.totalBalance) * 100 : 0}
            />
            <SummaryCard title="Allocation Breakdown" value="">
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Crypto</span>
                    <span>{portfolio.allocation.crypto.toFixed(1)}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${portfolio.allocation.crypto}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Stocks</span>
                    <span>{portfolio.allocation.stocks.toFixed(1)}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400"
                      style={{ width: `${portfolio.allocation.stocks}%` }}
                    />
                  </div>
                </div>
              </div>
            </SummaryCard>
          </section>

          <section className="grid xl:grid-cols-5 gap-4">
            <div className="xl:col-span-2">
              <Card
                title="Watchlist Preview"
                subtitle={
                  lastUpdated ? `Last update ${lastUpdated.toLocaleTimeString()}` : 'Connecting to market feed'
                }
                action={
                  <Button variant="secondary" size="sm" onClick={refresh}>
                    Refresh
                  </Button>
                }
              >
                <div className="space-y-2">
                  {watchlist.map((item) => (
                    <WatchlistRow key={item.id} item={item} movement={movements[item.id]} />
                  ))}
                </div>
              </Card>
            </div>

            <div className="xl:col-span-3 grid md:grid-cols-3 gap-4">
              <MarketList title="Top Gainers" items={marketOverview.gainers} />
              <MarketList title="Top Losers" items={marketOverview.losers} />
              <MarketList title="Most Active" items={marketOverview.mostActive} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
