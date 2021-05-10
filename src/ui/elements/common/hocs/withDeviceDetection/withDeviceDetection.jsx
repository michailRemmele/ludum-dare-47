import React from 'react';

import { getDisplayName, isTouchDevice } from '../../../../../utils';

export function withDeviceDetection(WrappedComponent) {
  class WithGame extends React.Component {
    render() {
      return (
        <WrappedComponent
          touchDevice={isTouchDevice()}
          {...this.props}
        />
      );
    }
  }

  WithGame.displayName = `WithGame(${getDisplayName(WrappedComponent)})`;
  return WithGame;
}
