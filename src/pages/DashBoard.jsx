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
      <CryptoDashboard />
    </div>
  )
}

export default DashBoard
