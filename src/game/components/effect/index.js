import { Component } from 'remiz';

import { applicatorOptions } from './applicatorOptions';

export class Effect extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._action = config.action;
    this._type = config.type;
    this._options = { ...config.options };

    const EffectApplicator = applicatorOptions[this._type];

    if (EffectApplicator) {
      this._applicatorOptions = new EffectApplicator(config.applicatorOptions);
    }
  }

  set action(action) {
    this._action = action;
  }

  get action() {
    return this._action;
  }

  set type(type) {
    this._type = type;
  }

  get type() {
    return this._type;
  }

  set options(options) {
    this._options = options;
  }

  get options() {
    return this._options;
  }

  set applicatorOptions(applicatorOptions) {
    this._applicatorOptions = applicatorOptions;
  }

  get applicatorOptions() {
    return this._applicatorOptions;
  }

  clone() {
    return new Effect(this.componentName, {
      action: this.action,
      type: this.type,
      options: this.options,
      applicatorOptions: this.applicatorOptions,
    });
  }
}
