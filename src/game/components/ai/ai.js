import { Component } from '@flyer-engine/core';

class AI extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._strategy = config.strategy;
  }

  set strategy(strategy) {
    this._strategy = strategy;
  }

  get strategy() {
    return this._strategy;
  }

  clone() {
    return new AI(this.componentName, {
      strategy: this.strategy,
    });
  }
}

export default AI;
