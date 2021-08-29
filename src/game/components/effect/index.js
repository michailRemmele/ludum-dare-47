import { Component } from '@flyer-engine/core';

import { applicatorOptions } from './applicatorOptions';

export class Effect extends Component {
  constructor(config) {
    super();

    this._name = config.name;
    this._type = config.type;
    this._options = { ...config.options };

    const EffectApplicator = applicatorOptions[this._type];

    if (EffectApplicator) {
      this._applicatorOptions = new EffectApplicator(config.applicatorOptions);
    }
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
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
    return new Effect({
      name: this.name,
      type: this.type,
      options: this.options,
      applicatorOptions: this.applicatorOptions,
    });
  }
}
