import React from 'react';

export function DataTable({
  columns,
  data,
  emptyMessage = 'No rows available',
  rowKey,
  className = '',
}) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-white/10 ${className}`}>
      <table className="min-w-full text-sm">
        <thead className="bg-white/5 text-left">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-3 py-2 font-semibold text-blue-100 whitespace-nowrap">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-4 text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={rowKey ? rowKey(row, index) : row.id || row.symbol || index}
                className="border-t border-white/10"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-3 py-2 align-middle">
                    {column.render ? column.render(row, index) : row[column.key]}
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

export default DataTable;
