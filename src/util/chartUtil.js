

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

export const formatStockChartData = (dailyData, points = 7) => {
  const orderedDates = Object.keys(dailyData);
  const selectedDates =
    points === 'all' ? orderedDates : orderedDates.slice(0, Math.max(2, Number(points) || 7));
  const dates = selectedDates.reverse();

  return {
    labels: dates.map((date) => new Date(date).toLocaleDateString()),
    datasets: [
      {
        label: 'Stock Price (USD)',
        data: dates.map(date => Number(dailyData[date]['4. close'])),
        borderColor: '#10b981',
        fill: false,
      },
    ],
  };
};
