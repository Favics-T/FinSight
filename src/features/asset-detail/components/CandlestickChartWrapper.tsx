import React, { useMemo } from 'react';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { calculateEMA, calculateSMA } from '../utils/indicators';
import type { OhlcPoint } from '../types';

ChartJS.register(
  TimeScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CandlestickController,
  CandlestickElement
);

interface CandlestickChartWrapperProps {
  candles: OhlcPoint[];
}

export function CandlestickChartWrapper({ candles }: CandlestickChartWrapperProps) {
  const { chartData, chartOptions } = useMemo(() => {
    const candlestickData = candles.map((item) => ({
      x: item.time,
      o: item.open,
      h: item.high,
      l: item.low,
      c: item.close,
    }));

    const smaData = calculateSMA(candles, 10);
    const emaData = calculateEMA(candles, 10);

    const data: ChartData<'candlestick'> = {
      datasets: [
        {
          type: 'candlestick',
          label: 'Price',
          // financial plugin format
          data: candlestickData as never,
          borderColor: {
            up: '#22c55e',
            down: '#ef4444',
            unchanged: '#a0a8b8',
          } as never,
          backgroundColor: {
            up: '#22c55e66',
            down: '#ef444466',
            unchanged: '#a0a8b866',
          } as never,
        } as never,
        {
          type: 'line',
          label: 'SMA (10)',
          data: smaData as never,
          borderColor: '#60a5fa',
          borderWidth: 1.6,
          pointRadius: 0,
          tension: 0.25,
        } as never,
        {
          type: 'line',
          label: 'EMA (10)',
          data: emaData as never,
          borderColor: '#f59e0b',
          borderWidth: 1.6,
          pointRadius: 0,
          tension: 0.25,
        } as never,
      ],
    };

    const options: ChartOptions<'candlestick'> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      animation: {
        duration: 380,
        easing: 'easeOutQuart',
      },
      plugins: {
        legend: {
          labels: {
            color: '#c9d8ff',
            boxWidth: 12,
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#0f1e3f',
          titleColor: '#e9f0ff',
          bodyColor: '#c9d8ff',
        },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
          },
          ticks: {
            color: '#8ea6d8',
            maxRotation: 0,
          },
          grid: {
            color: 'rgba(255,255,255,0.06)',
          },
        },
        y: {
          ticks: {
            color: '#8ea6d8',
            callback: (value) => `$${Number(value).toLocaleString()}`,
          },
          grid: {
            color: 'rgba(255,255,255,0.08)',
          },
        },
      },
    };

    return { chartData: data, chartOptions: options };
  }, [candles]);

  return (
    <div className="h-[360px] md:h-[440px] w-full">
      <Chart type="candlestick" data={chartData} options={chartOptions} />
    </div>
  );
}

export default CandlestickChartWrapper;
