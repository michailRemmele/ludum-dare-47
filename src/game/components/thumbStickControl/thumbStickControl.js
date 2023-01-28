import { Component } from 'remiz';

class ThumbStickControl extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    const { inputEventBindings } = config;

    this._inputEventBindings = inputEventBindings.reduce((acc, bind) => {
      acc[bind.event] = {
        messageType: bind.messageType,
        attrs: bind.attrs.reduce((attrs, attr) => {
          attrs[attr.name] = attr.value;
          return attrs;
        }, {}),
      };
      return acc;
    }, {});
  }

  set inputEventBindings(inputEventBindings) {
    this._inputEventBindings = inputEventBindings;
  }

  get inputEventBindings() {
    return this._inputEventBindings;
  }

  clone() {
    return new ThumbStickControl(this.componentName, {
      inputEventBindings: Object.keys(this._inputEventBindings).map(
        (key) => ({
          event: key,
          messageType: this.inputEventBindings[key].messageType,
          attrs: Object.keys(this.inputEventBindings[key].attrs).map(
            (name) => ({ name, value: this.inputEventBindings[key].attrs[name] }),
          ),
        }),
      ),
    });
  }
}

export default ThumbStickControl;
