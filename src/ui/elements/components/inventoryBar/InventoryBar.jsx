import React from 'react';
import PropTypes from 'prop-types';

import ActionView from '../../atoms/actionView/ActionView';

import './style.css';

const ACTION_KEY = 'I';

class InventoryBar extends React.PureComponent {
  render() {
    return (
      <ActionView
        className={`inventory-bar ${this.props.className}`}
        onClick={this.props.onClick}
        stopPropagate={true}
      >
        <span className='inventory-bar__key'>
          {ACTION_KEY}
        </span>
        Inventory
      </ActionView>
    );
  }
}

InventoryBar.defaultProps = {
  className: '',
  onClick: () => {},
};

InventoryBar.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default InventoryBar;
