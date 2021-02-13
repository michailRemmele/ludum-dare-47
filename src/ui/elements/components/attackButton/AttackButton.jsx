import React from 'react';
import PropTypes from 'prop-types';

import ActionView from '../../atoms/actionView/ActionView';

import './style.css';

const AttackButton = ({
  className,
  onClick,
}) => (
  <ActionView
    className={`attack-button ${className}`}
    onClick={onClick}
    stopPropagate={true}
  />
);

AttackButton.defaultProps = {
  className: '',
  onClick: () => {},
};

AttackButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default React.memo(AttackButton);
