import { Component } from 'remiz';

export class ViewDirection extends Component {
  constructor(config) {
    super(config);

    this.x = config.x;
    this.y = config.y;
  }

  clone() {
    return new ViewDirection({
      x: this.x,
      y: this.y,
    });
  }
}

ViewDirection.componentName = 'ViewDirection';
