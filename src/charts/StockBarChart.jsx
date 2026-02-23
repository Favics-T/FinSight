import React, { useEffect, useState } from 'react'
import { getStockDaily } from '../services/stockAPI';
import { formatStockChartData } from '../util/chartUtil';
import { Line } from 'react-chartjs-2';

const StockBarChart = ({ symbol }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(()=>{
    if (!symbol) return;

    getStockDaily(symbol).then(response=>{
      const daily = response.data['Time Series (Daily)'];
      if (!daily) {
        setChartData(null);
        return;
      }
      const data = formatStockChartData(daily);
      setChartData(data);
    }).catch(() => setChartData(null));
  },[symbol])

  return chartData ? <Line data={chartData} /> : <p>Loading chart...</p>
}

export default StockBarChart
