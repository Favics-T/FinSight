import React, { useState, useContext, useEffect, useRef } from 'react';
import { FaChartLine } from "react-icons/fa6";
import { MdOutlineDarkMode, MdViewSidebar } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBar from './SearchBar';
import { SideBarContext } from '../context/SideBarContext';

const Nav = () => {
  const [view, setView] = useState(false);
  const dropDown = useRef(null);
  const { SideBarList } = useContext(SideBarContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDown.current && !dropDown.current.contains(event.target)) {
        setView(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 relative z-40">
      <motion.div
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="md:px-10 px-4 font-sans md:py-5 py-3 glass border-b border-white/10 flex justify-between items-center"
      >
        <Link to="/dashboard" className="flex gap-3 items-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
            <FaChartLine className="text-xl" />
          </div>
          <div>
            <h1 className="font-semibold Inter leading-2.5 text-xl">FinSight</h1>
            <p className="text-xs text-muted">Crypto & Stock Intelligence</p>
          </div>
        </Link>

        <div className="md:block hidden">
          <ol className="flex items-center gap-4">
            <SearchBar />
            <button className="h-10 w-10 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
              <MdOutlineDarkMode className="text-2xl" />
            </button>
            <button className="h-10 w-10 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
              <IoMdNotifications className="text-2xl" />
            </button>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center font-semibold">
              FS
            </div>
          </ol>
        </div>

        <button
          type="button"
          className="md:hidden block cursor-pointer"
          onClick={() => setView((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <MdViewSidebar className="text-3xl text-blue-300" />
        </button>
      </motion.div>

      <AnimatePresence>
        {view && (
          <motion.div
            ref={dropDown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-2 left-2 md:hidden z-20"
          >
            <ol className="flex flex-col glass py-3 rounded-xl shadow-lg px-4 gap-4 mt-2">
              <SearchBar />
              <div className="space-y-2">
                {SideBarList.map(({ title, path }) => (
                  <Link
                    key={path}
                    to={path}
                    className="block p-2 rounded-lg hover:bg-white/10 transition"
                  >
                    {title}
                  </Link>
                ))}
              </div>
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Nav;
