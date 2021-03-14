import React from 'react';
import PropTypes from 'prop-types';

import ActionView from '../../atoms/actionView/ActionView';

import './style.css';

const IconButton = ({
  className,
  onClick,
  icon,
}) => (
  <ActionView
    className={`icon-button ${className}`}
    onClick={onClick}
    stopPropagate={true}
  >
    <img src={icon} className='icon-button__icon' />
  </ActionView>
);

IconButton.defaultProps = {
  className: '',
  onClick: () => {},
};

IconButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
};

export default React.memo(IconButton);
