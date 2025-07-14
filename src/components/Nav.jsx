import React, { useState,useContext, useEffect, useRef } from 'react'
import { FaChartLine } from "react-icons/fa6";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import DataContext from '../context/DataContext';
import SearchBar from './SearchBar';
import { ThemeContext } from '../context/ThemeContext';
import { SiDbeaver } from 'react-icons/si';
import SideBar from './SideBar'
import { MdViewSidebar } from "react-icons/md";
import { SideBarContext } from '../context/SideBarContext';
import { Link } from 'react-router-dom';


const Nav = () => {

const {theme, toggleTheme} = useContext(ThemeContext)
const [search, setSearch] = useState("");
const [view, setView] = useState(false);

const dropDown = useRef(null);

useEffect(()=>{
  const handleClickOutside = (event)=>{
    if(dropDown.current && !dropDown.current.contains(event.target)){
      setView(false);
    }}

    document.addEventListener('mousedown', handleClickOutside);
    return ()=>{
      document.removeEventListener('mousedown', handleClickOutside)
    }
},[view])

                              
const  {SideBarList} = useContext(SideBarContext);
console.log(SideBarList);





  return (
    <div className='sticky top-0 relative '>
     
    <div className='md:px-10 px-4 font-sans md:py-5 py-2 shadow-lg flex justify-between '>
        
        <div className='flex gap-2 items-center  '>
            <FaChartLine className='text-xl'/>
            <h1 className='font-semibold Inter leading-2.5 text-xl'>FinSight</h1>
        </div>
 {/* Logo */}
       
        {/* list */}
    <div className='md:block hidden '>
<ol className='flex items-center gap-4'>
<SearchBar className='inline'/>
<MdOutlineDarkMode className='text-3xl '/>
<IoMdNotifications className='text-3xl '/>
<div className=' p-5 rounded-full bg-gray-200 '>
<img src="" alt="" />
</div>
</ol>


        </div>

        <div className='md:hidden block cursor-pointer' onClick={()=>setView(!view)}>
            <MdViewSidebar  className='text-3xl text-blue-600'/>
           
        </div>
        
    </div>

     {
              view &&(
                <div ref={dropDown}>
                  <div className='absolute right-0 md:hidden'>
<ol className='flex flex-col border  py-3 border-gray-500 rounded-lg shadow-lg bg-blue-400 text-white  px-6 items-center gap-4'>
{/* <SearchBar className=''/> */}
<SearchBar />
{/* <div className=' md:p-5 p-2 rounded-full bg-gray-200 '>
<img src="" alt="" />
</div> */}
{/* <button
onClick={toggleTheme}
>
    <MdOutlineDarkMode className='md:text-3xl text-sm '/>
  </button> */}
{/* <IoMdNotifications className='md:text-3xl text-sm '/> */}
 <div className="space-y-4 ">
       {
        SideBarList.map(({title,path})=>(
          <div key={path}>
              <Link to={path}>
                 <h1>{title}</h1>
              </Link>
             
            </div>
        ))
       }
      </div>
</ol>


        </div>
                </div>
              )
            }
    </div>
  )
}

export default Nav
