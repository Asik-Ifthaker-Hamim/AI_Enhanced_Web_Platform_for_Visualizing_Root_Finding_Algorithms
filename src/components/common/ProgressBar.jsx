// Progress bar component for showing calculation progress and completion status
import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ progress, title }) => {
  const containerStyles = {
    height: 25,
    width: '100%',
    backgroundColor: '#e0e0de',
    borderRadius: 50,
    margin: '10px 0',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1) inset',
  };

  const fillerStyles = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: '#4caf50',
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'width 1s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  };

  const labelStyles = {
    padding: 15,
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.8rem',
  };

  return (
    <div>
      <h4 style={{ margin: '10px 0 5px' }}>{title}</h4>
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{`${Math.round(progress)}%`}</span>
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default ProgressBar; 