import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getStockDaily } from '../services/stockAPI';
import { formatStockChartData } from '../util/chartUtil';

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      ticks: { color: '#93aee5' },
      grid: { color: 'rgba(255,255,255,0.06)' },
    },
    y: {
      ticks: { color: '#93aee5' },
      grid: { color: 'rgba(255,255,255,0.08)' },
    },
  },
};

const StockBarChart = ({ symbol, points = 7 }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    getStockDaily(symbol)
      .then((response) => {
        const daily = response.data['Time Series (Daily)'];
        if (!daily) {
          setChartData(null);
          return;
        }
        const data = formatStockChartData(daily, points);
        setChartData(data);
      })
      .catch(() => setChartData(null));
  }, [symbol, points]);

  return (
    <div className="w-full h-[320px]">
      {chartData ? <Line data={chartData} options={chartOptions} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default StockBarChart;
