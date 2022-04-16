import React from 'react';

import { GameContext } from '../../../../contexts';
import { getDisplayName } from '../../../../../utils';

export function withGame(WrappedComponent) {
  class WithGame extends React.Component {
    render() {
      return (
        <GameContext.Consumer>
          {({ messageBusObserver, storeObserver, pushMessage, pushAction, entities }) => (
            <WrappedComponent
              messageBusObserver={messageBusObserver}
              storeObserver={storeObserver}
              pushMessage={pushMessage}
              pushAction={pushAction}
              entities={entities}
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
