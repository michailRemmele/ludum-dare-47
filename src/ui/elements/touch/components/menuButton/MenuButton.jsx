import React from 'react';
import PropTypes from 'prop-types';

import { IconButton } from '../../../common';

import './style.css';

export const MenuButton = ({
  className,
  onClick,
  icon,
}) => (
  <IconButton
    className={`menu-button ${className}`}
    onClick={onClick}
    icon={icon}
  />
);

MenuButton.defaultProps = {
  className: '',
  onClick: () => {},
};

MenuButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
};

export const MenuButtonMemoized = React.memo(MenuButton);
