import React from 'react';
import { MdDashboard } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { BsDisplayportFill } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { LiaAssistiveListeningSystemsSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';

const SideBar = ({ showSidebar }) => {
  const SideBarList = [
    { title: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
    { title: "Market", icon: <FaChartLine />, path: "/market" },
    { title: "WatchList", icon: <CiStar />, path: "/watchlist" },
    { title: "Portfolio", icon: <BsDisplayportFill />, path: "/portfolio" },
    { title: "Settings", icon: <CiSettings />, path: "/settings" },
    { title: "CryptoList", icon: <LiaAssistiveListeningSystemsSolid />, path: "/cryptolist" }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-[70%] md:w-[19%]  shadow-lg mt-20 border-r border-gray-300 z-50 transform transition-transform duration-300 
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:block`}
    >
      <div className="space-y-4 px-5 py-9">
        {SideBarList.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-200 w-full hover:rounded p-3 hover:text-blue-600 "
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default SideBar;
