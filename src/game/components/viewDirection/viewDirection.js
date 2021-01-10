import { Component } from '@flyer-engine/core';

class ViewDirection extends Component {
  constructor(config) {
    super();

    this._angle = config.angle;
  }

  set angle(angle) {
    this._angle = angle;
  }

  get angle() {
    return this._angle;
  }

  clone() {
    return new ViewDirection({
      angle: this.angle,
    });
  }
}

export default ViewDirection;
