import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchCryptoMarketChart } from '../services/cryptoAPI';
import { formatCryptoChartData } from '../util/chartUtil';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const CryptoChart = ({ coinId = 'bitcoin' }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchCryptoMarketChart(coinId)
      .then((response) => {
        const data = formatCryptoChartData(response.data.prices);
        setChartData(data);
      })
      .catch(() => setChartData(null));
  }, [coinId]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: '#0f1e3f',
        borderColor: '#4f8cff',
        borderWidth: 1,
        callbacks: {
          label: (context) => `Price: $${context.parsed.y.toFixed(2)}`,
          title: (context) => `Date: ${context[0].label}`,
        },
      },
      legend: { display: false },
    },
    elements: {
      line: {
        tension: 0.35,
        borderWidth: 2.5,
        borderColor: '#4f8cff',
      },
      point: {
        radius: 0,
        hoverRadius: 5,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.06)',
        },
        ticks: {
          color: '#93aee5',
        },
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.08)',
        },
        ticks: {
          color: '#93aee5',
        },
      },
    },
  };

  return (
    <div className="w-full h-[320px] md:h-[380px]">
      {chartData ? <Line data={chartData} options={chartOptions} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default CryptoChart;
