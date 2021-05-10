import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { ActionBar } from '../actionBar';
import healPotionIcon from '../../../../media/images/heal-potion.png';
import powerPotionIcon from '../../../../media/images/power-potion.png';

import './style.css';

const ITEMS = {
  healPotion: {
    name: 'Heal Potion',
    key: '1',
    iconSrc: healPotionIcon,
  },
  powerPotion: {
    name: 'Power Potion',
    key: '2',
    iconSrc: powerPotionIcon,
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
      <li className='items-bar-desktop__item' key={name}>
        <ActionBar
          className='items-bar-desktop__action-bar'
          onClick={(event) => onUseItem(event, name)}
          keyName={ITEMS[name].key}
          title={`x ${items[name]}`}
          iconSrc={ITEMS[name].iconSrc}
          iconDescr={ITEMS[name].name}
          size='sm'
        />
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
    <ul className={`items-bar-desktop ${className}`}>
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
