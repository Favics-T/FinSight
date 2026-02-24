import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SideBarContext } from '../context/SideBarContext';

const SideBar = ({ showSidebar }) => {
  const { SideBarList } = useContext(SideBarContext);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-[75%] md:w-[19%] mt-20 z-30 transform transition-transform duration-300
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:block`}
    >
      <div className="h-[calc(100vh-6rem)] mx-3 glass rounded-2xl border border-white/10 px-4 py-6 overflow-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-muted px-2 mb-4">Navigation</p>

        <div className="space-y-2">
          {SideBarList.map(({ title, path, icon }, index) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
            >
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 text-sm cursor-pointer w-full rounded-xl p-3 transition ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/20 border border-blue-300/35 text-white'
                      : 'text-blue-100/85 hover:bg-white/10'
                  }`
                }
              >
                <span className="text-lg">{icon}</span>
                <span>{title}</span>
              </NavLink>
            </motion.div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
