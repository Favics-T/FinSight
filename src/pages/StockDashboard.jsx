import React, { useContext, useEffect } from 'react';
import DataContext from '../context/DataContext';

const StockDashboard = () => {
  const { stocksData, fetchMultipleStockQuotes } = useContext(DataContext);

  useEffect(() => {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
    fetchMultipleStockQuotes(symbols);
  }, [fetchMultipleStockQuotes]);

  // Check if stocksData is empty or undefined
  const isLoading = !stocksData || Object.keys(stocksData).length === 0;

  if (isLoading) {
    return <p>Loading stock data...</p>;
  }

  return (
    <div>
      <div className='grid grid-cols-4 gap-4'>
        {Object.entries(stocksData).map(([symbol, data]) => {
          // Check if data for a symbol is missing
          if (!data) {
            return (
              <div key={symbol} className='border  py-6 px-4 flex flex-col border-gray-200   shadow 
               gap-6 rounded-lg  '>

                  {/* symbol and dollar */}
                  <div className='flex justify-between '>
                    <h1 className='font-semibold text-sm'>{symbol}</h1>
                    <p className='text-gray-500'>$</p>
                  </div>
                
                <p>No data available</p>
              </div>
            );
          }

          // Render stock info if data is available
          return (
            <div key={symbol} className='border border-gray-200 p-4 rounded shadow'>
              <h1>{symbol}</h1>
              <p>Price: ${data['05. price']}</p>
              <p>
                Change: {data['09. change']} ({data['10. change percent']})
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockDashboard;
