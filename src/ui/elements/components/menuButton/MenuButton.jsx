import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '../iconButton/IconButton';

import './style.css';

const MenuButton = ({
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

export default React.memo(MenuButton);
