import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const MODS = {
  healPotion: 'heal',
  powerPotion: 'power',
};

class ItemsBar extends React.PureComponent {
  renderItem(name, index) {
    if (!this.props[name]) {
      return;
    }

    return (
      <li className='items-bar__item' key={name}>
        <span className='items-bar__key'>
          {index + 1}
        </span>
        <span className={`items-bar__count items-bar__count_${MODS[name]}`}>
          x {this.props[name]}
        </span>
      </li>
    );
  }

  renderItems() {
    const items = [ 'healPotion', 'powerPotion' ];

    return items.reduce((storage, name, index) => {
      const item = this.renderItem(name, index);

      if (!item) {
        return storage;
      }

      storage.push(item);

      return storage;
    }, []);
  }

  render() {
    return (
      <ul className={`items-bar ${this.props.className}`}>
        {this.renderItems()}
      </ul>
    );
  }
}

ItemsBar.defaultProps = {
  className: '',
};

ItemsBar.propTypes = {
  className: PropTypes.string,
  healPotion: PropTypes.number,
  powerPotion: PropTypes.number,
};

export default ItemsBar;
