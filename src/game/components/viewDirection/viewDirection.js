import { Component } from '@flyer-engine/core';

class ViewDirection extends Component {
  constructor(componentName, config) {
    super(componentName, config);

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
    return new ViewDirection(this.componentName, {
      x: this.x,
      y: this.y,
    });
  }
}

export default ViewDirection;
