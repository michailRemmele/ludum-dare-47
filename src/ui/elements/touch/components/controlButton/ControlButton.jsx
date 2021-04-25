import React from 'react';
import PropTypes from 'prop-types';

import { IconButton } from '../../../common';

import './style.css';

const ControlButton = ({
  className,
  onClick,
  icon,
  size,
}) => (
  <IconButton
    className={`control-button control-button_${size} ${className}`}
    onClick={onClick}
    icon={icon}
  />
);

ControlButton.defaultProps = {
  className: '',
  onClick: () => {},
  size: 'md',
};

ControlButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  size: PropTypes.oneOf([ 'md', 'lg' ]),
};

export const ControlButtonMemoized = React.memo(ControlButton);
