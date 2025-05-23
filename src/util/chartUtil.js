

export const formatCryptoChartData = (prices) => {
  return {
    labels: prices.map(price => new Date(price[0]).toLocaleDateString()),
    datasets: [
      {
        label: 'Price (USD)',
        data: prices.map(price => price[1]),
        borderColor: '#3b82f6',
        fill: false,
      },
    ],
  };
};

export const formatStockChartData = (dailyData) => {
  const dates = Object.keys(dailyData).slice(0, 7).reverse();
  return {
    labels: dates,
    datasets: [
      {
        label: 'Stock Price (USD)',
        data: dates.map(date => dailyData[date]['4. close']),
        borderColor: '#10b981',
        fill: false,
      },
    ],
  };
};
