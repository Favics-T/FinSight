import React from 'react';
import { useNavigate } from 'react-router-dom';

const Button = ({ name, path, onClick, className, type = 'button' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <button
      type={type}
      className={`border border-blue-400/40 bg-white/5 hover:bg-blue-500/25 px-3 py-1.5 rounded-lg transition ${className || ''}`}
      onClick={handleClick}
    >
      {name}
    </button>
  );
};

export default Button;
