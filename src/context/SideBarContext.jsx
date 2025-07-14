import React, { createContext } from 'react'
import { MdDashboard } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { BsDisplayportFill } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { LiaAssistiveListeningSystemsSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';


export const SideBarContext = createContext();

const SideBarProvider = ({ children }) => {
     const SideBarList = [
        { title: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
        { title: "Market", icon: <FaChartLine />, path: "/market" },
        { title: "WatchList", icon: <CiStar />, path: "/watchlist" },
        { title: "Portfolio", icon: <BsDisplayportFill />, path: "/portfolio" },
        { title: "Settings", icon: <CiSettings />, path: "/settings" },
        { title: "CryptoList", icon: <LiaAssistiveListeningSystemsSolid />, path: "/cryptolist" }
      ];

    
  return (
    
      <SideBarContext.Provider value={{
                                SideBarList
      }}>
        {children}
      </SideBarContext.Provider>
    
  )
}

export default SideBarProvider
