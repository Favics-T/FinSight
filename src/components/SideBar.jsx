import React from 'react';
import { MdDashboard } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { BsDisplayportFill } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { LiaAssistiveListeningSystemsSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';

const SideBar = () => {
  const SideBarList = [
    { title: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
    { title: "Market", icon: <FaChartLine />, path: "/market" },
    { title: "WatchList", icon: <CiStar />, path: "/watchlist" },
    { title: "Portfolio", icon: <BsDisplayportFill />, path: "/portfolio" },
    { title: "Settings", icon: <CiSettings />, path: "/settings" },
    { title: "CryptoList", icon: <LiaAssistiveListeningSystemsSolid />, path: "/cryptolist" }
  ];

  return (
    <aside className="hidden md:block fixed top-0 left-0 mt-22 h-screen w-[19%] bg-white shadow-lg border-r border-gray-300 z-50">
      <div className="space-y-4 px-5 py-9">
        {SideBarList.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-200 w-full hover:rounded hover:px-3 hover:py-3 hover:text-blue-600 transition"
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
