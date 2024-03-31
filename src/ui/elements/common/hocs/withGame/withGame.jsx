import React from 'react';

import { GameContext } from '../../../../contexts';
import { getDisplayName } from '../../../../../utils';

export function withGame(WrappedComponent) {
  class WithGame extends React.Component {
    render() {
      return (
        <GameContext.Consumer>
          {(gameContextProps) => (
            <WrappedComponent
              {...gameContextProps}
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
