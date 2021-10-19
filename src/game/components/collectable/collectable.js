import { Component } from '@flyer-engine/core';

class Collectable extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._name = config.name;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  clone() {
    return new Collectable(this.componentName, {
      name: this.name,
    });
  }
}

export default Collectable;
