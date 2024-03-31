import { Component } from 'remiz';

export class AI extends Component {
  constructor(config) {
    super(config);

    this.strategy = config.strategy;
  }

  clone() {
    return new AI({
      strategy: this.strategy,
    });
  }
}

AI.componentName = 'AI';
