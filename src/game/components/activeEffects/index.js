import { Component } from 'remiz';

export class ActiveEffects extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._list = config ? [ ...config.list ] : [];
    this._map = config ? { ...config.map } : {};
  }

  set list(list) {
    this._list = list;
  }

  get list() {
    return this._list;
  }

  set map(map) {
    this._map = map;
  }

  get map() {
    return this._map;
  }

  clone() {
    return new ActiveEffects(this.componentName, {
      list: this.list,
      map: this.map,
    });
  }
}
