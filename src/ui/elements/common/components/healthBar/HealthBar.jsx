import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

export class HealthBar extends React.PureComponent {
  render() {
    const { health, maxHealth, className } = this.props;
    return (
      <div
        className={`health-bar ${className}`}
      >
        <div
          className='health-bar__points'
          style={{ width: `${maxHealth ? (health / maxHealth * 100) : 0}%` }}
        />
      </div>
    );
  }
}

HealthBar.defaultProps = {
  className: '',
  health: 0,
  maxHealth: 100,
};

HealthBar.propTypes = {
  className: PropTypes.string,
  health: PropTypes.number,
  maxHealth: PropTypes.number,
};
