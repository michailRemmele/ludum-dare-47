import { Component } from 'remiz';

export class AutoAim extends Component {
  constructor() {
    super();

    this.targetX = 0;
    this.targetY = 0;
  }

  clone() {
    return new AutoAim();
  }
}

AutoAim.componentName = 'AutoAim';
