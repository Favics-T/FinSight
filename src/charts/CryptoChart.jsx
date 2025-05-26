import React, { useEffect, useState } from 'react'
import {Line} from 'react-chartjs-2'
import { fetchCryptoMarketChart } from '../services/cryptoAPI';
import { formatCryptoChartData } from '../util/chartUtil';



const CryptoChart = ( {coinId} ) => {
    const[chartData, setChartData] = useState(null);
    useEffect(()=>{
        fetchCryptoMarketChart(coinId).then(response =>{
            const data = formatCryptoChartData(response.data.prices);
            setChartData(data);
        });
    },[coinId])
   
    return (
        <div>
            {
    chartData ? 
   <div className=' '>
 <Line
 className='w-full  '
  data={chartData} />
   </div>
     :<p>Loading chart...</p>
            }
     </div>
    )
    
}

export default CryptoChart
