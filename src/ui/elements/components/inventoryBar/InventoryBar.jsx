import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const ACTION_KEY = 'I';

class InventoryBar extends React.PureComponent {
  render() {
    return (
      <div className={`inventory-bar ${this.props.className}`}>
        <span className='inventory-bar__key'>
          {ACTION_KEY}
        </span>
        Inventory
      </div>
    );
  }
}

InventoryBar.defaultProps = {
  className: '',
};

InventoryBar.propTypes = {
  className: PropTypes.string,
};

export default InventoryBar;
