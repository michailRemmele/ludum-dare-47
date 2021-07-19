import React from 'react';
import PropTypes from 'prop-types';

import { ActionView } from '../actionView';

import './style.css';

export const IconButton = React.forwardRef(({
  className,
  onClick,
  onPointerUp,
  onPointerDown,
  icon,
  ...props
}, ref) => (
  <ActionView
    {...props}
    ref={ref}
    className={`icon-button ${className}`}
    onClick={onClick}
    onPointerUp={onPointerUp}
    onPointerDown={onPointerDown}
    stopPropagate={true}
  >
    <img src={icon} className='icon-button__icon' />
  </ActionView>
));

IconButton.defaultProps = {
  className: '',
  onClick: () => {},
  onPointerUp: () => {},
};

IconButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  onPointerUp: PropTypes.func,
  onPointerDown: PropTypes.func,
  icon: PropTypes.string,
};

IconButton.displayName = 'IconButton';

export const IconButtonMemoized = React.memo(IconButton);
