import React from 'react';
import { MdDashboard } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { BsDisplayportFill } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { Link } from 'react-router-dom'

const SideBar = () => {
  const SideBarList = [
    { title: "Dashboard", icon: <MdDashboard /> },
    { title: "Market", icon: <FaChartLine /> },
    { title: "WatchList", icon: <CiStar /> },
    { title: "Portfolio", icon: <BsDisplayportFill /> },
    { title: "Settings", icon: <CiSettings /> }
  ];

  return (
    <div className="border flex  border-gray-300 w-[19%] h-screen px-5 py-9">
      <div className="space-y-4">
        {SideBarList.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-200 w-full hover:rounded hover:px-3 hover:py-3 hover:text-blue-600 transition"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
