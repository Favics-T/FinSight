import React from 'react';
import { Card } from '../../../components/ui/Card';

function formatValue(value, formatter) {
  if (formatter) return formatter(value);
  if (typeof value === 'number') return value.toLocaleString();
  return value;
}

export const SummaryCard = React.memo(function SummaryCard({
  title,
  value,
  subtitle,
  trend,
  formatter,
  children,
}) {
  const trendClass =
    trend == null ? 'text-muted' : trend >= 0 ? 'text-emerald-400' : 'text-red-400';

  return (
    <Card title={title} subtitle={subtitle} className="h-full">
      <div className="space-y-2">
        <p className="text-2xl font-bold">{formatValue(value, formatter)}</p>
        {trend != null ? <p className={`text-sm font-medium ${trendClass}`}>{trend.toFixed(2)}%</p> : null}
        {children}
      </div>
    </Card>
  );
});

export default SummaryCard;

