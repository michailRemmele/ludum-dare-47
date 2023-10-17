import { Component } from 'remiz';

export class ActiveEffects extends Component {
  constructor(config) {
    super(config);

    this.list = config ? [ ...config.list ] : [];
    this.map = config ? { ...config.map } : {};
  }

  clone() {
    return new ActiveEffects({
      list: this.list,
      map: this.map,
    });
  }
}

ActiveEffects.componentName = 'ActiveEffects';
