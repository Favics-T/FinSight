import React from 'react';

const variants = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-400',
  secondary: 'bg-white/10 hover:bg-white/20 text-white border-white/20',
  ghost: 'bg-transparent hover:bg-white/10 text-white border-white/10',
  danger: 'bg-red-500 hover:bg-red-600 text-white border-red-400',
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm';

  return (
    <button
      className={`rounded-lg border transition font-medium ${variants[variant]} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
