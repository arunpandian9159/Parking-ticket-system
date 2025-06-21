import React from 'react';
import PropTypes from 'prop-types';

const TableControls = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  totalCount,
  filteredCount,
  children
}) => {
  return (
    <div className="table-controls">
      <div className="table-search">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="table-filters">
        {filters.map((filter, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {filter.label && (
              <label style={{ fontSize: '14px', color: '#6b7280' }}>
                {filter.label}:
              </label>
            )}
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="form-select"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        
        {(totalCount !== undefined && filteredCount !== undefined) && (
          <span style={{ color: '#6b7280', fontSize: '14px' }}>
            {filteredCount} of {totalCount} items
          </span>
        )}
        
        {children}
      </div>
    </div>
  );
};

TableControls.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  filters: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })).isRequired,
    label: PropTypes.string
  })),
  totalCount: PropTypes.number,
  filteredCount: PropTypes.number,
  children: PropTypes.node
};

export default TableControls;
