import { Component } from '@flyer-engine/core';

class ViewDirection extends Component {
  constructor(config) {
    super();

    this._x = config.x;
    this._y = config.y;
  }

  set x(x) {
    this._x = x;
  }

  get x() {
    return this._x;
  }

  set y(y) {
    this._y = y;
  }

  get y() {
    return this._y;
  }

  clone() {
    return new ViewDirection({
      x: this.x,
      y: this.y,
    });
  }
}

export default ViewDirection;
