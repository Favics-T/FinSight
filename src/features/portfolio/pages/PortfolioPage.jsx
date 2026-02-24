import React, { useEffect, useMemo, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import DataTable from '../../../components/ui/DataTable';
import { useToast } from '../../../hooks/useToast';
import { getCryptoMarkets } from '../../../services/crypto.service';
import { getStockQuotes } from '../../../services/stock.service';
import { usePortfolioStore, portfolioSelectors } from '../../../store/portfolio-store';
import { validatePositionInput } from '../utils/calculations';

const EMPTY_FORM = {
  assetType: 'stock',
  symbol: '',
  name: '',
  quantity: '',
  averagePrice: '',
};

const colorPalette = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316'];

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function PortfolioPage() {
  const positions = usePortfolioStore(portfolioSelectors.positions);
  const holdings = usePortfolioStore(portfolioSelectors.holdings);
  const totals = usePortfolioStore(portfolioSelectors.totals);
  const allocation = usePortfolioStore(portfolioSelectors.allocation);
  const performance = usePortfolioStore(portfolioSelectors.performance);
  const syncStatus = usePortfolioStore(portfolioSelectors.syncStatus);

  const setPrices = usePortfolioStore((state) => state.setPrices);
  const addPosition = usePortfolioStore((state) => state.addPositionOptimistic);
  const updatePosition = usePortfolioStore((state) => state.updatePositionOptimistic);
  const removePosition = usePortfolioStore((state) => state.removePositionOptimistic);

  const { pushToast } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPrices() {
      if (positions.length === 0) return;
      setLoadingPrices(true);

      try {
        const cryptoIds = positions
          .filter((p) => p.assetType === 'crypto')
          .map((p) => p.symbol.toLowerCase());

        const stockSymbols = positions
          .filter((p) => p.assetType === 'stock')
          .map((p) => p.symbol.toUpperCase());

        const [cryptoData, stockData] = await Promise.all([
          cryptoIds.length ? getCryptoMarkets({ ids: cryptoIds, perPage: cryptoIds.length }) : Promise.resolve([]),
          stockSymbols.length ? getStockQuotes(stockSymbols) : Promise.resolve([]),
        ]);

        if (!active) return;

        const updates = {};

        for (const coin of cryptoData) {
          updates[`crypto:${String(coin.id).toLowerCase()}`] = Number(coin.currentPrice || 0);
        }

        for (const stock of stockData) {
          updates[`stock:${String(stock.symbol).toLowerCase()}`] = Number(stock.price || 0);
        }

        setPrices(updates);
      } catch (error) {
        pushToast({
          variant: 'error',
          title: 'Price sync failed',
          description: error.message || 'Could not refresh live prices.',
        });
      } finally {
        if (active) setLoadingPrices(false);
      }
    }

    loadPrices();
    const timer = setInterval(loadPrices, 30000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [positions, setPrices, pushToast]);

  const pieData = useMemo(
    () => ({
      labels: allocation.map((item) => item.label),
      datasets: [
        {
          data: allocation.map((item) => item.value),
          backgroundColor: allocation.map((_, index) => colorPalette[index % colorPalette.length]),
          borderColor: 'rgba(255,255,255,0.15)',
          borderWidth: 1,
        },
      ],
    }),
    [allocation]
  );

  const lineData = useMemo(
    () => ({
      labels: performance.map((item) => item.label),
      datasets: [
        {
          label: 'Portfolio Value',
          data: performance.map((item) => item.value),
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96,165,250,0.2)',
          tension: 0.35,
          fill: true,
          pointRadius: 0,
        },
      ],
    }),
    [performance]
  );

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { ticks: { color: '#8ea6d8' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: {
          ticks: {
            color: '#8ea6d8',
            callback: (value) => `$${Number(value).toLocaleString()}`,
          },
          grid: { color: 'rgba(255,255,255,0.08)' },
        },
      },
    }),
    []
  );

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validatePositionInput(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const payload = {
      assetType: form.assetType,
      symbol: form.symbol,
      name: form.name,
      quantity: Number(form.quantity),
      averagePrice: Number(form.averagePrice),
    };

    const result = editingId
      ? await updatePosition(editingId, payload)
      : await addPosition(payload);

    if (result.ok) {
      pushToast({
        variant: 'success',
        title: editingId ? 'Position updated' : 'Position added',
      });
      resetForm();
    } else {
      pushToast({
        variant: 'error',
        title: 'Save failed',
        description: 'Could not persist changes. Your previous state was restored.',
      });
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      assetType: row.assetType,
      symbol: row.symbol,
      name: row.name || '',
      quantity: String(row.quantity),
      averagePrice: String(row.averagePrice),
    });
    setErrors({});
  };

  const handleRemove = async (id) => {
    const result = await removePosition(id);
    if (!result.ok) {
      pushToast({
        variant: 'error',
        title: 'Delete failed',
        description: 'Could not remove position. Changes were rolled back.',
      });
      return;
    }

    pushToast({ variant: 'success', title: 'Position removed' });
  };

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card title="Total Market Value" action={null}>
          <p className="text-2xl font-bold">{formatCurrency(totals.totalMarketValue)}</p>
        </Card>
        <Card title="Total Cost Basis" action={null}>
          <p className="text-2xl font-bold">{formatCurrency(totals.totalCostBasis)}</p>
        </Card>
        <Card title="Unrealized P/L" action={null}>
          <p className={`text-2xl font-bold ${totals.totalUnrealizedPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(totals.totalUnrealizedPL)}
          </p>
        </Card>
        <Card title="Unrealized P/L %" action={null}>
          <p className={`text-2xl font-bold ${totals.totalUnrealizedPLPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totals.totalUnrealizedPLPercent.toFixed(2)}%
          </p>
        </Card>
      </section>

      <section className="grid xl:grid-cols-5 gap-4">
        <Card
          title={editingId ? 'Edit Position' : 'Add Position'}
          subtitle="Optimistic updates with validation"
          action={null}
          className="xl:col-span-2"
        >
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`rounded-lg border px-3 py-2 text-sm ${
                  form.assetType === 'stock' ? 'bg-blue-500 border-blue-400' : 'bg-white/5 border-white/15'
                }`}
                onClick={() => setForm((prev) => ({ ...prev, assetType: 'stock' }))}
              >
                Stock
              </button>
              <button
                type="button"
                className={`rounded-lg border px-3 py-2 text-sm ${
                  form.assetType === 'crypto' ? 'bg-blue-500 border-blue-400' : 'bg-white/5 border-white/15'
                }`}
                onClick={() => setForm((prev) => ({ ...prev, assetType: 'crypto' }))}
              >
                Crypto
              </button>
            </div>
            {errors.assetType ? <p className="text-xs text-red-300">{errors.assetType}</p> : null}

            <div>
              <input
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2"
                placeholder={form.assetType === 'crypto' ? 'Coin id (e.g. bitcoin)' : 'Stock symbol (e.g. AAPL)'}
                value={form.symbol}
                onChange={(e) => setForm((prev) => ({ ...prev, symbol: e.target.value }))}
              />
              {errors.symbol ? <p className="text-xs text-red-300 mt-1">{errors.symbol}</p> : null}
            </div>

            <input
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2"
              placeholder="Name (optional)"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                />
                {errors.quantity ? <p className="text-xs text-red-300 mt-1">{errors.quantity}</p> : null}
              </div>

              <div>
                <input
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2"
                  placeholder="Avg Price"
                  value={form.averagePrice}
                  onChange={(e) => setForm((prev) => ({ ...prev, averagePrice: e.target.value }))}
                />
                {errors.averagePrice ? <p className="text-xs text-red-300 mt-1">{errors.averagePrice}</p> : null}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="submit" variant="primary" disabled={syncStatus === 'saving'}>
                {editingId ? 'Save Changes' : 'Add Position'}
              </Button>
              {editingId ? (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card title="Allocation" subtitle="Current portfolio composition" action={null} className="xl:col-span-3">
          {allocation.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-muted">No allocation data yet.</div>
          ) : (
            <div className="h-[260px]">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: { color: '#c9d8ff' },
                    },
                  },
                }}
              />
            </div>
          )}
        </Card>
      </section>

      <section className="grid xl:grid-cols-5 gap-4">
        <Card
          title="Holdings"
          subtitle={loadingPrices ? 'Refreshing market prices...' : 'Live valuation of positions'}
          action={null}
          className="xl:col-span-3"
        >
          {loadingPrices && positions.length > 0 ? <Skeleton className="h-2 w-24 mb-3" /> : null}
          <DataTable
            columns={[
              {
                key: 'asset',
                header: 'Asset',
                render: (row) => (
                  <div>
                    <p className="font-semibold">{row.symbol.toUpperCase()}</p>
                    <p className="text-xs text-muted">{row.assetType}</p>
                  </div>
                ),
              },
              { key: 'quantity', header: 'Qty', render: (row) => Number(row.quantity).toLocaleString() },
              { key: 'averagePrice', header: 'Avg Price', render: (row) => formatCurrency(row.averagePrice) },
              { key: 'costBasis', header: 'Cost Basis', render: (row) => formatCurrency(row.costBasis) },
              { key: 'marketValue', header: 'Market Value', render: (row) => formatCurrency(row.marketValue) },
              {
                key: 'unrealizedPL',
                header: 'Unrealized P/L',
                render: (row) => (
                  <span className={row.unrealizedPL >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {formatCurrency(row.unrealizedPL)} ({row.unrealizedPLPercent.toFixed(2)}%)
                  </span>
                ),
              },
              {
                key: 'allocation',
                header: 'Allocation',
                render: (row) => `${row.allocationPercent.toFixed(2)}%`,
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(row)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleRemove(row.id)}>
                      Remove
                    </Button>
                  </div>
                ),
              },
            ]}
            data={holdings}
            emptyMessage="No positions yet. Add your first holding."
          />
        </Card>

        <Card title="Portfolio Performance" subtitle="30-day portfolio value simulation" action={null} className="xl:col-span-2">
          {performance.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-muted">No performance data yet.</div>
          ) : (
            <div className="h-[280px]">
              <Line data={lineData} options={lineOptions} />
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
