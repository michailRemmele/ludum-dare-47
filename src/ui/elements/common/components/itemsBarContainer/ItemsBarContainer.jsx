import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { CollectService } from '../../../../../game/systems';
import { withGame, withDeviceDetection } from '../../../common';
import { ItemsBar as ItemsBarDesktop } from '../../../desktop';
import { ItemsBar as ItemsBarTouch } from '../../../touch';

const USE_ITEM_MSG = 'USE_ITEM';

export const ItemsBarContainer = ({
  className,
  user,
  pushMessage,
  gameStateObserver,
  sceneContext,
  touchDevice,
}) => {
  const [ items, setItems ] = useState({});

  const handleUseItem = useCallback((event, item) => {
    event.stopPropagation();

    pushMessage({
      type: USE_ITEM_MSG,
      id: user.getId(),
      gameObject: user,
      item,
    });
  }, [ user, pushMessage ]);

  useEffect(() => {
    const handleGameStateUpdate = () => {
      const collectService = sceneContext.getService(CollectService);
      const { healPotion, powerPotion } = collectService.getInventory();

      if (healPotion !== items.healPotion || powerPotion !== items.powerPotion) {
        setItems({ healPotion, powerPotion });
      }
    };

    gameStateObserver.subscribe(handleGameStateUpdate);

    return () => gameStateObserver.unsubscribe(handleGameStateUpdate);
  }, [ items, gameStateObserver, sceneContext ]);

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
  sceneContext: PropTypes.any,
  pushMessage: PropTypes.func,
  touchDevice: PropTypes.bool,
};

export const WrappedItemsBarContainer = withDeviceDetection(withGame(ItemsBarContainer));
