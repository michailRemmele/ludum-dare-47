import { Component } from 'remiz';

export class Collectable extends Component {
  constructor(config) {
    super(config);

    this.name = config.name;
  }

  clone() {
    return new Collectable({
      name: this.name,
    });
  }
}

Collectable.componentName = 'Collectable';
