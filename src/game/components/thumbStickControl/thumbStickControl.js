import { Component } from '@flyer-engine/core';

class ThumbStickControl extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._inputEventBindings = config.inputEventBindings;
  }

  set inputEventBindings(inputEventBindings) {
    this._inputEventBindings = inputEventBindings;
  }

  get inputEventBindings() {
    return this._inputEventBindings;
  }

  clone() {
    return new ThumbStickControl(this.componentName, {
      inputEventBindings: {
        ...this.inputEventBindings,
      },
    });
  }
}

export default ThumbStickControl;
