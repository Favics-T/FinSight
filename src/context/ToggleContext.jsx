import React, { createContext, useContext, useState } from 'react'

const ToggleContext = createContext();

export const ToggleProvider = ( {children} ) => {
    const [mode,setMode] = useState('crypto');

    const toggleMode = ()=>{
        setMode(prev => prev === "stock"? "stock":"crypto"

        )
    }

  return (
    <div>
      <ToggleContext.Provider value={{mode,toggleMode,setMode}}>
        {children}
      </ToggleContext.Provider>
    </div>
  )
}

export const useToggle = ()=>useContext(ToggleContext);