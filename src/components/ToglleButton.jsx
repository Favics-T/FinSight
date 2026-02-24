import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToggle } from '../context/ToggleContext';

const ToglleButton = () => {
  const { setMode } = useToggle();
  const location = useLocation();

  return (
    <div className="glass p-1 rounded-xl flex gap-1 w-fit">
      <Link to="/stockdashboard">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setMode('stock')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
            location.pathname === '/stockdashboard'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-blue-100 hover:bg-white/10'
          }`}
        >
          Stocks
        </motion.button>
      </Link>

      <Link to="/cryptodashboard">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setMode('crypto')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
            location.pathname === '/cryptodashboard' || location.pathname === '/dashboard'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-blue-100 hover:bg-white/10'
          }`}
        >
          Crypto
        </motion.button>
      </Link>
    </div>
  );
};

export default ToglleButton;
