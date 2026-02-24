import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTimeframe } from '../../context/TimeframeContext';

const visiblePaths = ['/dashboard', '/crypto', '/stocks'];

export function MarketToolbar() {
  const { timeframes, timeframe, setTimeframe } = useTimeframe();
  const location = useLocation();

  const showToolbar = visiblePaths.some((path) => location.pathname.startsWith(path));
  if (!showToolbar) return null;

  return (
    <section className="glass rounded-xl p-3 md:p-4 mb-4 border border-white/10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex gap-2">
          <NavLink
            to="/crypto"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                isActive ? 'bg-blue-500 text-white' : 'bg-white/5 text-blue-100 hover:bg-white/10'
              }`
            }
          >
            Crypto
          </NavLink>
          <NavLink
            to="/stocks"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                isActive ? 'bg-blue-500 text-white' : 'bg-white/5 text-blue-100 hover:bg-white/10'
              }`
            }
          >
            Stocks
          </NavLink>
        </div>

        <div className="flex gap-2 flex-wrap">
          {timeframes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTimeframe(item)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                timeframe === item
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 border border-white/10 text-blue-100 hover:bg-white/10'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MarketToolbar;

