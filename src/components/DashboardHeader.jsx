import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ToglleButton from './ToglleButton';

const DashboardHeader = () => {
  const dailyTrends = ['1D', '1W', '1M', '1Y', 'All'];
  const [activeTrend, setActiveTrend] = useState('1D');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="py-6"
    >
      <div className="flex flex-col gap-4 glass rounded-2xl p-4 md:p-5">
        <div className="flex justify-between items-center gap-3">
          <Link to="/dashboard">
            <h1 className="font-semibold Inter text-2xl">Dashboard</h1>
            <p className="text-sm text-muted">Track live movements across your portfolio</p>
          </Link>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl py-2 px-4 text-white font-semibold shadow-lg shadow-blue-600/30 hover:scale-[1.02] transition">
            Add Asset
          </button>
        </div>

        <div className="flex md:flex-row flex-col gap-4 justify-between md:items-center mt-1">
          <ToglleButton />

          <div className="flex gap-2 flex-wrap">
            {dailyTrends.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveTrend(item)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  activeTrend === item
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 border border-white/10 text-blue-100 hover:bg-white/10'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
