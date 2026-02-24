import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { CardSkeleton, TableSkeleton } from '../../../components/ui/Skeleton';
import { getCryptoMarkets } from '../../../services/crypto.service';
import { getStockQuotes } from '../../../services/stock.service';
import { useToast } from '../../../hooks/useToast';

const trackedSymbols = ['AAPL', 'MSFT', 'NVDA'];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [crypto, setCrypto] = useState([]);
  const [stocks, setStocks] = useState([]);
  const { pushToast } = useToast();

  useEffect(() => {
    let mounted = true;

    Promise.all([
      getCryptoMarkets({ perPage: 6 }),
      getStockQuotes(trackedSymbols),
    ])
      .then(([cryptoData, stockData]) => {
        if (!mounted) return;
        setCrypto(cryptoData);
        setStocks(stockData);
      })
      .catch((error) => {
        pushToast({
          variant: 'error',
          title: 'Failed to load dashboard',
          description: error.message,
        });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [pushToast]);

  const stats = useMemo(() => {
    const totalMarketCap = crypto.reduce((sum, item) => sum + item.marketCap, 0);
    const avgStockMove = stocks.length
      ? stocks.reduce((sum, item) => sum + item.changePercent, 0) / stocks.length
      : 0;

    return [
      { label: 'Tracked Crypto', value: String(crypto.length) },
      { label: 'Combined Market Cap', value: `$${Math.round(totalMarketCap).toLocaleString()}` },
      { label: 'Avg Stock Move', value: `${avgStockMove.toFixed(2)}%` },
    ];
  }, [crypto, stocks]);

  return (
    <div className="space-y-6">
      <section className="grid md:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => <CardSkeleton key={idx} />)
          : stats.map((item) => (
              <Card key={item.label} title={item.label}>
                <p className="text-2xl font-bold">{item.value}</p>
              </Card>
            ))}
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <Card title="Crypto Movers" subtitle="Top market-cap assets">
          {loading ? (
            <TableSkeleton />
          ) : (
            <Table
              columns={[
                { key: 'name', header: 'Asset' },
                { key: 'symbol', header: 'Symbol', render: (row) => row.symbol.toUpperCase() },
                {
                  key: 'currentPrice',
                  header: 'Price',
                  render: (row) => `$${row.currentPrice.toLocaleString()}`,
                },
                {
                  key: 'change24h',
                  header: '24h',
                  render: (row) => (
                    <span className={row.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {row.change24h.toFixed(2)}%
                    </span>
                  ),
                },
              ]}
              data={crypto}
            />
          )}
        </Card>

        <Card title="Stock Quotes" subtitle="Tracked symbols">
          {loading ? (
            <TableSkeleton />
          ) : (
            <Table
              columns={[
                { key: 'symbol', header: 'Symbol' },
                { key: 'price', header: 'Price', render: (row) => `$${row.price.toFixed(2)}` },
                {
                  key: 'changePercent',
                  header: 'Change %',
                  render: (row) => (
                    <span className={row.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {row.changePercent.toFixed(2)}%
                    </span>
                  ),
                },
              ]}
              data={stocks}
            />
          )}
        </Card>
      </section>
    </div>
  );
}
