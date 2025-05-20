import React from 'react'
import { FaChartLine } from "react-icons/fa6";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { CiSearch } from "react-icons/ci";

const Nav = () => {
  return (
    <div>
     
    <div className='px-10 font-sans  py-5 shadow-lg flex justify-between '>
        
        <div className='flex gap-2 items-center  '>
            <FaChartLine className='text-xl'/>
            <h1 className='font-semibold Inter leading-2.5 text-xl'>FinSight</h1>
        </div>
 {/* Logo */}
       
        {/* list */}
    <div className='flex items-center gap-4'>

{/* search icon */}
       <label className="relative block w-full max-w-md">
  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
    <CiSearch />
  </span>
  <input
    type="text"
    placeholder="Search"
    className="w-full pl-10 pr-4 py-2  border border-gray-400 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</label>

<MdOutlineDarkMode className='text-3xl'/>
<IoMdNotifications className='text-3xl'/>
<div className=' p-5 rounded-full bg-gray-200'>
<img src="" alt="" />
</div>
        </div>
        
    </div>
    </div>
  )
}

export default Nav
