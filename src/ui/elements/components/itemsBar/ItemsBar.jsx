import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const ITEMS = {
  healPotion: {
    key: 'R',
    mod: 'heal',
  },
  powerPotion: {
    key: 'Q',
    mod: 'power',
  },
};

class ItemsBar extends React.PureComponent {
  renderItem(name) {
    if (!this.props[name]) {
      return;
    }

    return (
      <li className='items-bar__item' key={name}>
        <span className='items-bar__key'>
          {ITEMS[name].key}
        </span>
        <span className={`items-bar__count items-bar__count_${ITEMS[name].mod}`}>
          x {this.props[name]}
        </span>
      </li>
    );
  }

  renderItems() {
    const items = [ 'healPotion', 'powerPotion' ];

    return items.reduce((storage, name) => {
      const item = this.renderItem(name);

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
