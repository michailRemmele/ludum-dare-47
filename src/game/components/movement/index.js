import { Component, Vector2 } from 'remiz';

export class Movement extends Component {
  constructor(config) {
    super(config);

    this.speed = config.speed;
    this.vector = new Vector2(0, 0);
    this.penalty = 0;
  }

  clone() {
    return new Movement({
      speed: this.speed,
    });
  }
}

Movement.componentName = 'Movement';
