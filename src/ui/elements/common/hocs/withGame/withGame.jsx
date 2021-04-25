import React from 'react';

import { GameContext } from '../../../../contexts';
import { getDisplayName } from '../../../../../utils';

export function withGame(WrappedComponent) {
  class WithGame extends React.Component {
    render() {
      return (
        <GameContext.Consumer>
          {({ messageBusObserver, storeObserver, pushMessage, pushAction, gameObjects }) => (
            <WrappedComponent
              messageBusObserver={messageBusObserver}
              storeObserver={storeObserver}
              pushMessage={pushMessage}
              pushAction={pushAction}
              gameObjects={gameObjects}
              {...this.props}
            />
          )}
        </GameContext.Consumer>
      );
    }
  }

  WithGame.displayName = `WithGame(${getDisplayName(WrappedComponent)})`;
  return WithGame;
}
