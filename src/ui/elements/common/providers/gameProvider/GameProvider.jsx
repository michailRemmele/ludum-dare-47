import React from 'react';
import PropTypes from 'prop-types';

import { GameContext } from '../../../../contexts';

export class GameProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: { ...props },
    };
  }

  render() {
    return (
      <GameContext.Provider value={this.state.value}>
        {this.props.children}
      </GameContext.Provider>
    );
  }
}

GameProvider.propTypes = {
  children: PropTypes.node,
  gameStateObserver: PropTypes.any,
  gameObjectObserver: PropTypes.any,
  scene: PropTypes.any,
  pushAction: PropTypes.func,
};
