import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SideBarContext } from '../context/SideBarContext';

const SideBar = ({ showSidebar }) => {
 

  const {SideBarList} = useContext(SideBarContext);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-[70%] md:w-[19%]  shadow-lg mt-20 border-r border-gray-300 z-50 transform transition-transform duration-300 
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:block`}
    >
      <div className="space-y-4 px-5 py-9">
        {SideBarList.map(({title, path, icon}) => (
          <Link
            to={path}
            key={path}
            className="flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-200 w-full hover:rounded p-3 hover:text-blue-600 "
          >
            <span className="text-lg">{icon}</span>
            <span>{title}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default SideBar;
