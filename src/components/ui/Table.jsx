import React from 'react';

export function Table({ columns, data, emptyText = 'No data available' }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="min-w-full text-sm">
        <thead className="bg-white/5 text-left">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold text-blue-100">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="px-4 py-4 text-muted" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id || row.symbol || index} className="border-t border-white/10">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-blue-50">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
