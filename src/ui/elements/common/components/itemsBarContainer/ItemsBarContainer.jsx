import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { EventType } from '../../../../../events';
import { CollectService } from '../../../../../game/scripts';
import { withGame, withDeviceDetection } from '../../../common';
import { ItemsBar as ItemsBarDesktop } from '../../../desktop';
import { ItemsBar as ItemsBarTouch } from '../../../touch';

export const ItemsBarContainer = ({
  className,
  user,
  gameStateObserver,
  scene,
  touchDevice,
}) => {
  const [ items, setItems ] = useState({});

  const handleUseItem = useCallback((event, item) => {
    event.stopPropagation();

    user.emit(EventType.UseItem, { item });
  }, [ user ]);

  useEffect(() => {
    const handleGameStateUpdate = () => {
      const collectService = scene.getService(CollectService);
      const { healPotion, powerPotion } = collectService.getInventory();

      if (healPotion !== items.healPotion || powerPotion !== items.powerPotion) {
        setItems({ healPotion, powerPotion });
      }
    };

    gameStateObserver.subscribe(handleGameStateUpdate);

    return () => gameStateObserver.unsubscribe(handleGameStateUpdate);
  }, [ items, gameStateObserver, scene ]);

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
  gameStateObserver: PropTypes.any,
  scene: PropTypes.any,
  touchDevice: PropTypes.bool,
};

export const WrappedItemsBarContainer = withDeviceDetection(withGame(ItemsBarContainer));
