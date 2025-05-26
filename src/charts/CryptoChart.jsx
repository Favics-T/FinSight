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

const CryptoChart = ({ coinId }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchCryptoMarketChart(coinId).then((response) => {
      const data = formatCryptoChartData(response.data.prices);
      setChartData(data);
    });
  }, [coinId]);

  //my chart design here
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // this allows me to control heigth with css
     plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `Price: $${context.parsed.y.toFixed(2)}`,
          title: (context) => `Date: ${context[0].label}`
        }
      },
      legend: { display: false },
    },
    elements: {
      line: {
        tension: 0.3, // curve of the line (0 = straight, 1 = curvy)
        borderWidth: 2,
        borderColor: '#3B82F6', 
      },
      point: {
        radius: 0,
        hoverRadius:5 
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280' 
        }
      },
      y: {
        grid: {
          color: '#E5E7EB'
        },
        ticks: {
          color: '#6B7280'
        }
      }
    }
  };

  return (
    <div className="md:w-[900px] sm:w-[550px] w-[300px] h-96  ">
      {chartData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default CryptoChart;
