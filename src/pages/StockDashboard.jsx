import React, { useContext, useEffect,useState } from 'react';
import DataContext from '../context/DataContext';
import { fetchExchangeRate, fetchStockPrice } from '../services/stockAPI';
import StockBarChart from '../charts/StockBarChart';

const StockDashboard = () => {
  const { stocksData, fetchMultipleStockQuotes } = useContext(DataContext);

    const [exchangeRate, setExchangeRate] = useState(null)
    const [stockPrice, setStockPrice] = useState(null);
    const [convertedPrice, setConvertedPrice] = useState(null);
    const [currency, setCurrency] = useState('EUR'); 
  
  //   useEffect(() => {
  //   const fetchPriceAndConvert = async () => {
  //     try {
  //       const stockRes = await fetchStockPrice('AAPL');
  //       const rawPrice = parseFloat(stockRes.data['Global Quote']['05. price']);
  //       setStockPrice(rawPrice);
  
  //       const fxRes = await fetchExchangeRate('USD', currency);
  //       const rate = parseFloat(fxRes.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
  
  //       const converted = rawPrice * rate;
  //       setConvertedPrice(converted.toFixed(2)); 
  //     } catch (error) {
  //       console.error('Error fetching price or conversion rate:', error);
  //     }
  //   };
  
  //   fetchPriceAndConvert();
  // }, [currency]); //if currency changes, this will run
  
  useEffect(() => {
  const fetchRate = async () => {
    try {
      const fxRes = await fetchExchangeRate('USD', currency);
      const rate = parseFloat(fxRes.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
      setExchangeRate(rate);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  fetchRate();
}, [currency]);


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
    <div className='flex flex-col'>


    {/* 
    <div>


 <div className="mb-6">
  <label className="block font-semibold mb-2">Convert Currency:</label>
  <select
    className="border px-3 py-2 rounded"
    onChange={(e) => setCurrency(e.target.value)}
    value={currency}
  >
    <option value="USD">USD</option>
    <option value="EUR">EUR</option>
    <option value="NGN">NGN</option>
    <option value="GBP">GBP</option>
  </select>

  <p className="mt-2">AAPL Price (USD): ${stockPrice}</p>
  <p>Converted Price ({currency}): {convertedPrice}</p>
</div>



      <div className='grid md:grid-cols-4 gap-4'>
        {
        !exchangeRate ? (
          <p>Loading exchange rate...</p>):(
        Object.entries(stocksData).map(([symbol, data]) => {

          const priceUSD = parseFloat(data['05. price']);
          const converted = exchangeRate ? (priceUSD * exchangeRate).toFixed(2):'....'
          // const converted = (priceUSD * exchangeRate).toFixed(2);
          // Check if data for a symbol is missing
          if (!data) {
            return (
              <div key={symbol} className='border  py-6 px-4 flex flex-col border-gray-200   shadow 
               gap-6 rounded-lg  '>

                  {/* symbol and dollar *
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
              <p>Price (USD): ${priceUSD}</p>
              <p>Price ({currency}): {converted}</p>

            </div>
          );
        }))}
      </div>


 <div className='border'>
 <StockBarChart />
      </div>


    </div> */}

   


      
     
     
    </div>
  );
};

export default StockDashboard;
