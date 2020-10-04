import { Component } from '@flyer-engine/core';

class Collectable extends Component {
  constructor(config) {
    super();

    this._name = config.name;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  clone() {
    return new Collectable({
      name: this.name,
    });
  }
}

export default Collectable;
