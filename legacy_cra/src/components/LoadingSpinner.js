import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({
  size = 'medium',
  text = 'Loading...',
  fullScreen = false
}) => {
  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px'
  };

  const spinnerSize = sizeMap[size];

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className="loading-spinner"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: size === 'large' ? '4px' : '3px'
        }}
      />
      {text && (
        <span className={`text-secondary font-medium ${size === 'large' ? 'text-base' : 'text-sm'}`}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white-90 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  text: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default LoadingSpinner;
