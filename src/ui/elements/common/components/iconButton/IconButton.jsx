import React from 'react';
import PropTypes from 'prop-types';

import { ActionView } from '../actionView';

import './style.css';

export const IconButton = ({
  className,
  onClick,
  onPointerUp,
  icon,
}) => (
  <ActionView
    className={`icon-button ${className}`}
    onClick={onClick}
    onPointerUp={onPointerUp}
    stopPropagate={true}
  >
    <img src={icon} className='icon-button__icon' />
  </ActionView>
);

IconButton.defaultProps = {
  className: '',
  onClick: () => {},
  onPointerUp: () => {},
};

IconButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  onPointerUp: PropTypes.func,
  icon: PropTypes.string,
};

export const IconButtonMemoized = React.memo(IconButton);
