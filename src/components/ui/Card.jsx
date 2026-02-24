import React from 'react';

export function Card({ title, subtitle, action, className = '', children }) {
  return (
    <section className={`glass rounded-xl border border-white/10 p-4 ${className}`}>
      {(title || subtitle || action) && (
        <header className="flex items-start justify-between mb-3">
          <div>
            {title && <h3 className="font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}

export default Card;
