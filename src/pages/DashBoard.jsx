import React, { useContext, useEffect, useState } from 'react'
import  DataContext  from '../context/DataContext'
import { getStockQuote, getStockDaily, handleStockSymbolSearch } from "../services/stockAPI";
import ToglleButton from '../components/ToglleButton';
import { useToggle } from '../context/ToggleContext';
import CryptoDashboard from './CryptoDashboard';
import StockDashboard from './StockDashboard';


const DashBoard = () => {

  // const[mode, setMode] = useState('crypto')
const searchStock = async (keyword) => {
    try {
      const response = await searchStockSymbol(keyword);
      setSearchResults(response.data.bestMatches || []);
    } catch (error) {
      console.error('Error searching stock:', error);
    }
  };

const coinData =[
    {name : "S&P 500", price: "4,783.45", currency: "$", percentage:"+1.41%"},
     {name : "Dow Jones", price: "45,783.45", currency: "$", percentage:"+1.41%"},
      {name : "NASDAQ 500", price: "4,783.45", currency: "$", percentage:"+1.41%"},
     {name : "Russell 2000", price: "1,992.66", currency: "$", percentage:"+0.87%"}
]

const { stockData, fetchStockQuote,mode } = useContext(DataContext);
const {toggleMode} = useToggle()

useEffect(()=>{
    fetchStockQuote('AAPL')
},[])

console.log("Current mode:", mode);
  


  return (
    <div className=' py-10 '>
      <div className='flex flex-col gap-4 '>

        {/* Subheader section */}
        

        {/* Daily show */}
        
        
       

        {/* money s&p */}
        <div className='grid md:grid-cols-4 grid:cols-2 gap-4'>
            {
                coinData.map((list, index)=>( 
                    <div className='shadow py-6 px-4 flex gap-6  border rounded-lg border-gray-200 flex-col' >
                        <div className='flex justify-between'>
                            <h1 className='font-semibold text-sm'>{list.name} </h1>
                            <p className='text-gray-500'>{list.currency}</p>
                        </div>
                        <div>
                            <h1 className='font-bold text-2xl'>{list.price}</h1>
                            <p className='text-green-400'>{list.percentage}</p>
                        </div>
                    </div>
                ))
            }
            

        </div>

        {/* stock performence */}
         <div className='grid grid-cols-2 gap-6'>
            <div className='border p-8 shadow border-gray-300 flex flex-col gap-10'>
                <h1 className='font-semibold text-3xl'>Crypto Performance</h1> 

                <div className='border-2 border-dashed border-gray-300 h-60'>

                </div>
            </div>
           
            <div className='border shadow p-8 border-gray-300'>
            <div>
                <h1 className='text-3xl font-semibold'>Watchlist</h1>
                <p className="text-gray-400">Your tracked Cryptocurrencies</p>
            </div>
            <div></div>
            </div>

        </div> 


      



      {/* <div>
      {stockData ? (
        <>
          <h2>{stockData['01. symbol']}</h2>
          <p>Price: ${stockData['05. price']}</p>
          <p>Change: {stockData['09. change']} ({stockData['10. change percent']})</p>
        </>
      ) : (
        <p>Loading stock data...</p>
      )}
    </div> */}
    <p>{mode} </p>
    {/* {mode ==='crypto' ? <CryptoDashboard /> : <div>jjjj</div>} */}
    
    </div>
    </div>
  )
}

export default DashBoard
