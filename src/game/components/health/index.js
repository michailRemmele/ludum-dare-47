import { Component } from 'remiz';

export class Health extends Component {
  constructor(config) {
    super(config);

    this.points = config.points;
    this.maxPoints = config.points;
  }

  clone() {
    return new Health({
      points: this.points,
      maxPoints: this.maxPoints,
    });
  }
}

Health.componentName = 'Health';
