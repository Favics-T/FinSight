import React, { useEffect, useState } from 'react'
import { getStockDaily } from '../services/stockAPI';
import { formatStockChartData } from '../util/chartUtil';
import { Line } from 'react-chartjs-2';

const StockBarChart = ({ symbol }) => {
  const [chartData, setChartData] = useState(null);



  useEffect(()=>{
    getStockDaily(symbol).then(response=>{
      const daily = response.data['Time Series (Daily'];
      const data = formatStockChartData(daily);
      setChartData(data);
    })
  },[symbol])

  return chartData ? <Line data={chartData} /> : <p>Loading chart....</p>
}

export default StockBarChart
