import React from 'react'
import { useToggle } from '../context/ToggleContext'

const ToglleButton = () => {
    const {mode, toggleMode,setMode } = useToggle();
  return (
   <div className='bg-blue-100 text-gray-500 py-2 px-3 items-center rounded flex gap-1'>
            <button 
            onClick={()=>setMode('stock')}
             className={`${
                mode==="stock" ?"bg-white text-black font-bold":"bg-blue-100" }
                 
             cursor-pointer bg-blue-100  px-1 py-0.5 font-semibold text-sm rounded`}>
              Stocks</button>
            <button 
            onClick={()=>setMode('crypto')}
            className={
               `
               ${mode==='crypto' ? "bg-white text-black font-bold":"bg-blue-100"}
               font-semibold px-2 text-sm cursor-pointer`}>
              Crypto</button>
        </div>
  )
}

export default ToglleButton
