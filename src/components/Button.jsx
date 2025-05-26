import React from 'react'
import { useNavigate } from 'react-router-dom'

const Button = ( {name,path,onClick,className} ) => {
    const navigate = useNavigate();

    const handleClick=()=>{
        if(onClick){
            onClick();
        }
        else if(path){
        navigate(path);
        }
    }
  return (
    <div>
      <button
      className={`border border-blue-600 hover:bg-blue-800 px-2 py-1 rounded-lg ${className}`}
      onClick={handleClick}
      >
            {name}
      </button>
    </div>
  )
}

export default Button
