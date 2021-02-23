import React from 'react';
import PropTypes from 'prop-types';

import ActionView from '../../atoms/actionView/ActionView';

import './style.css';

const IconButton = ({
  className,
  onClick,
  icon,
  size
}) => (
  <ActionView
    className={`icon-button icon-button_${size} ${className}`}
    onClick={onClick}
    stopPropagate={true}
  >
    <img src={icon} className="icon-button__icon" />
  </ActionView>
);

IconButton.defaultProps = {
  className: '',
  onClick: () => {},
  size: 'lg'
};

IconButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  size: PropTypes.oneOf(['lg'])
};

export default React.memo(IconButton);
