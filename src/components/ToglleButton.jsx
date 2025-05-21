import React from 'react'
import { useToggle } from '../context/ToggleContext'
import { Link,useLocation } from 'react-router-dom';
const ToglleButton = () => {
    const {mode, toggleMode,setMode } = useToggle();
    const location = useLocation();
  return (
   <div className='bg-blue-100 text-gray-500 py-2 px-3 items-center rounded flex gap-1'>
            <Link to='/stockdashboard'>
            <button 
            onClick={()=>setMode('stock')}
             className={`${
          location.pathname === '/stockdashboard' ? 'bg-white text-black font-bold' : 'bg-blue-100'
        } cursor-pointer px-2 py-1 rounded font-semibold text-sm`}>
              Stocks</button>
                    </Link>

<Link to='/cryptodashboard'>
            <button 
            onClick={()=>setMode('crypto')}
              className={`${
          location.pathname === '/cryptodashboard' ? 'bg-white text-black font-bold' : 'bg-blue-100'
        } cursor-pointer px-2 py-1 rounded font-semibold text-sm`}>
              Crypto</button>
              </Link>
        </div>
  )
}

export default ToglleButton
