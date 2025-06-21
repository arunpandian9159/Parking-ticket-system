import React from 'react';
import PropTypes from 'prop-types';

const EnhancedTable = ({
  data,
  columns,
  searchTerm = '',
  onSort,
  sortField,
  sortDirection,
  emptyMessage = 'No data found',
  emptyIcon = '📋',
  className = ''
}) => {
  const handleSort = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  if (data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">{emptyIcon}</div>
        <h3>No Data Found</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`table-wrapper ${className}`}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
                style={{
                  cursor: column.sortable ? 'pointer' : 'default',
                  userSelect: 'none'
                }}
                className={column.className}
              >
                {column.label} {column.sortable && getSortIcon(column.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
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
  emptyIcon: PropTypes.string,
  className: PropTypes.string
};

export default EnhancedTable;
