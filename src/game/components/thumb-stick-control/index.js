import { Component } from 'remiz';

export class ThumbStickControl extends Component {
  constructor(config) {
    super(config);

    const { inputEventBindings } = config;

    this.inputEventBindings = inputEventBindings.reduce((acc, bind) => {
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

  clone() {
    return new ThumbStickControl({
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

ThumbStickControl.componentName = 'ThumbStickControl';
