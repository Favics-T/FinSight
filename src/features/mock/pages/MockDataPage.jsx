import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { TableSkeleton } from '../../../components/ui/Skeleton';
import { getMockDashboardData } from '../../../services/mockData.service';

export default function MockDataPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ crypto: [], stocks: [] });

  useEffect(() => {
    getMockDashboardData().then((payload) => {
      setData(payload);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-4">
      <Card title="Mock Data Service" subtitle="Example service for local/dev testing">
        <p className="text-sm text-muted">
          This page demonstrates how to use the mock service without hitting external APIs.
        </p>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Mock Crypto">
          {loading ? (
            <TableSkeleton rows={3} />
          ) : (
            <Table
              columns={[
                { key: 'name', header: 'Asset' },
                { key: 'symbol', header: 'Symbol' },
                { key: 'currentPrice', header: 'Price' },
              ]}
              data={data.crypto}
            />
          )}
        </Card>

        <Card title="Mock Stocks">
          {loading ? (
            <TableSkeleton rows={3} />
          ) : (
            <Table
              columns={[
                { key: 'symbol', header: 'Symbol' },
                { key: 'price', header: 'Price' },
                { key: 'changePercent', header: 'Change %' },
              ]}
              data={data.stocks}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
