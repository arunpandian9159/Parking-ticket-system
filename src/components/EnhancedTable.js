import React from 'react';
import PropTypes from 'prop-types';
import { ChevronUp, ChevronDown, FileText } from 'lucide-react';

const EnhancedTable = ({
  data,
  columns,
  searchTerm = '',
  onSort,
  sortField,
  sortDirection,
  emptyMessage = 'No data found',
  emptyIcon = <FileText size={48} className="text-gray-400" />,
  className = ''
}) => {
  const handleSort = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center gap-4">
        <div className="p-4 bg-gray-50 rounded-full">
          {emptyIcon}
        </div>
        <h3 className="text-lg font-medium text-gray-900">No Data Found</h3>
        <p className="text-gray-500 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`table-wrapper ${className}`}>
      <table className="table w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
                className={`p-4 text-xs font-semibold uppercase tracking-wider ${column.className || ''} ${column.sortable ? 'cursor-pointer select-none transition-colors' : ''}`}
              >
                <div className="flex items-center gap-1">
                  {column.label}
                  {column.sortable && (
                    <span className="text-gray-400">
                      {getSortIcon(column.key) || <div className="w-3.5 h-3.5" />}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, index) => (
            <tr key={row.id || index} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className={`p-4 ${column.className || ''}`}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

EnhancedTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortable: PropTypes.bool,
    render: PropTypes.func,
    className: PropTypes.string
  })).isRequired,
  searchTerm: PropTypes.string,
  onSort: PropTypes.func,
  sortField: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  emptyMessage: PropTypes.string,
  emptyIcon: PropTypes.node,
  className: PropTypes.string
};

export default EnhancedTable;
