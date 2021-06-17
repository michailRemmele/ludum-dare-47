import React from 'react';
import PropTypes from 'prop-types';

import { TouchButton } from '../touchButton';

import './style.css';

const ControlButton = ({
  className,
  size,
  ...props
}) => (
  <TouchButton
    {...props}
    className={`control-button control-button_${size} ${className}`}
  />
);

ControlButton.defaultProps = {
  className: '',
  size: 'md',
};

ControlButton.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf([ 'md', 'lg' ]),
};

export const ControlButtonMemoized = React.memo(ControlButton);
