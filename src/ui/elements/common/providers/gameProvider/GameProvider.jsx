import React from 'react';
import PropTypes from 'prop-types';

import { GameContext } from '../../../../contexts';

export class GameProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        messageBusObserver: this.props.messageBusObserver,
        storeObserver: this.props.storeObserver,
        pushMessage: this.props.pushMessage,
        pushAction: this.props.pushAction,
        entities: this.props.entities,
      },
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
  messageBusObserver: PropTypes.any,
  storeObserver: PropTypes.any,
  pushMessage: PropTypes.func,
  pushAction: PropTypes.func,
  entities: PropTypes.any,
};
