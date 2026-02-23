import React, { createContext, useContext, useState } from 'react'

const ToggleContext = createContext();

export const ToggleProvider = ( {children} ) => {
    const [mode,setMode] = useState('crypto');

    const toggleMode = ()=>{
        setMode(prev => (prev === "stock"? "crypto":"stock")

        )
    }

  return (
    <ToggleContext.Provider value={{mode,toggleMode,setMode}}>
      {children}
    </ToggleContext.Provider>
  )
}

export const useToggle = ()=>useContext(ToggleContext);
