import { Component, Vector2 } from '@flyer-engine/core';

class Movement extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._speed = config.speed;
    this._vector = new Vector2(0, 0);
    this._penalty = 0;
  }

  set speed(speed) {
    this._speed = speed;
  }

  get speed() {
    return this._speed;
  }

  set vector(vector) {
    this._vector = vector;
  }

  get vector() {
    return this._vector;
  }

  set penalty(penalty) {
    this._penalty = penalty;
  }

  get penalty() {
    return this._penalty;
  }

  clone() {
    return new Movement(this.componentName, {
      speed: this.speed,
    });
  }
}

export default Movement;
