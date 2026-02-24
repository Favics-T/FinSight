import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaChartLine } from 'react-icons/fa6';
import { useUIStore } from '../../store/ui-store';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/crypto', label: 'Crypto' },
  { to: '/stocks', label: 'Stocks' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/mock', label: 'Mock Data' },
];

export function AppSidebar() {
  const { isSidebarOpen, closeSidebar } = useUIStore();

  return (
    <aside
      className={`fixed top-[64px] left-0 h-[calc(100vh-64px)] w-[78%] md:w-[18rem] z-40 transform transition-transform duration-200 md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full ml-3 mr-3 mt-3 glass rounded-2xl border border-white/10 p-4 overflow-y-auto">
        <Link to="/dashboard" className="flex items-center gap-3 mb-6" onClick={closeSidebar}>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <FaChartLine />
          </div>
          <div>
            <h1 className="font-semibold">FinSight</h1>
            <p className="text-xs text-muted">Trading Workspace</p>
          </div>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-blue-500/25 border border-blue-300/40 text-white'
                    : 'text-blue-100 hover:bg-white/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default AppSidebar;
