import { Component } from '@flyer-engine/core';

class ThumbStickControl extends Component {
  constructor(config) {
    super();

    this._inputEventBindings = config.inputEventBindings;
  }

  set inputEventBindings(inputEventBindings) {
    this._inputEventBindings = inputEventBindings;
  }

  get inputEventBindings() {
    return this._inputEventBindings;
  }

  clone() {
    return new ThumbStickControl({
      inputEventBindings: {
        ...this.inputEventBindings,
      },
    });
  }
}

export default ThumbStickControl;
