import { Component } from '@flyer-engine/core';

class Health extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._points = config.points;
    this._maxPoints = config.points;
  }

  set points(points) {
    this._points = points;
  }

  get points() {
    return this._points;
  }

  set maxPoints(maxPoints) {
    this._maxPoints = maxPoints;
  }

  get maxPoints() {
    return this._maxPoints;
  }

  clone() {
    return new Health(this.componentName, {
      points: this.points,
      maxPoints: this.maxPoints,
    });
  }
}

export default Health;
