import React from 'react';
import { useToggle } from '../context/ToggleContext';
import CryptoDashboard from './CryptoDashboard';
import StockDashboard from './StockDashboard';

const DashBoard = () => {
  const { mode } = useToggle();

  return (
    <div className="py-10">
      {mode === 'stock' ? <StockDashboard /> : <CryptoDashboard />}
    </div>
  );
};

export default DashBoard;
