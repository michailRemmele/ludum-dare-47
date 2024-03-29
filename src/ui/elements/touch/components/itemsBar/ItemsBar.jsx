import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { TouchButton } from '../touchButton';

import './style.css';

const ITEMS = {
  healPotion: {
    icon: './media/images/heal-potion.png',
  },
  powerPotion: {
    icon: './media/images/power-potion.png',
  },
};

export const ItemsBar = ({
  className,
  items,
  onUseItem,
}) => {
  const renderItem = useCallback((name) => {
    if (!items[name]) {
      return;
    }

    return (
      <li className='items-bar-touch__item' key={name}>
        <TouchButton
          className='items-bar-touch__icon-button'
          onClick={(event) => onUseItem(event, name)}
          icon={ITEMS[name].icon}
        />
        <span className='items-bar-touch__counter'>{items[name]}</span>
      </li>
    );
  }, [ items, onUseItem ]);

  const renderItems = useCallback(() => {
    return Object.keys(ITEMS).reduce((storage, name) => {
      const item = renderItem(name);

      if (!item) {
        return storage;
      }

      storage.push(item);

      return storage;
    }, []);
  }, [ renderItem ]);

  return (
    <ul className={`items-bar-touch ${className}`}>
      {renderItems()}
    </ul>
  );
};

ItemsBar.defaultProps = {
  className: '',
};

ItemsBar.propTypes = {
  className: PropTypes.string,
  items: PropTypes.object,
  onUseItem: PropTypes.func,
};
