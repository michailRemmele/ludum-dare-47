import React from 'react';
import PropTypes from 'prop-types';

import { TouchButton } from '../touchButton';

import './style.css';

export const MenuButton = ({
  className,
  ...props
}) => (
  <TouchButton
    {...props}
    className={`menu-button ${className}`}
  />
);

MenuButton.defaultProps = {
  className: '',
};

MenuButton.propTypes = {
  className: PropTypes.string,
};

export const MenuButtonMemoized = React.memo(MenuButton);
