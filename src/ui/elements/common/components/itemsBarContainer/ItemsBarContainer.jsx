import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { withGame, withDeviceDetection } from '../../../common';
import { ItemsBar as ItemsBarDesktop } from '../../../desktop';
import { ItemsBar as ItemsBarTouch } from '../../../touch';

const INVENTORY_KEY = 'inventory';
const USE_ITEM_MSG = 'USE_ITEM';

export const ItemsBarContainer = ({
  className,
  user,
  pushMessage,
  storeObserver,
  touchDevice,
}) => {
  const [ items, setItems ] = useState({});

  const handleUseItem = useCallback((event, item) => {
    event.stopPropagation();

    pushMessage({
      type: USE_ITEM_MSG,
      id: user.getId(),
      entity: user,
      item,
    });
  }, [ user, pushMessage ]);

  useEffect(() => {
    const handleStoreUpdate = (store) => {
      const { healPotion, powerPotion } = store.get(INVENTORY_KEY);

      if (healPotion !== items.healPotion || powerPotion !== items.powerPotion) {
        setItems({ healPotion, powerPotion });
      }
    };

    storeObserver.subscribe(handleStoreUpdate);

    return () => storeObserver.unsubscribe(handleStoreUpdate);
  }, [ items ]);

  const ItemsBar = touchDevice ? ItemsBarTouch : ItemsBarDesktop;

  return (
    <ItemsBar
      className={className}
      onUseItem={handleUseItem}
      items={items}
    />
  );
};

ItemsBarContainer.defaultProps = {
  className: '',
};

ItemsBarContainer.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
  storeObserver: PropTypes.any,
  pushMessage: PropTypes.func,
  touchDevice: PropTypes.bool,
};

export const WrappedItemsBarContainer = withDeviceDetection(withGame(ItemsBarContainer));
