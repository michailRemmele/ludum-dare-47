import { Component } from 'remiz';

import { applicatorOptions } from './applicator-options';

export class Effect extends Component {
  constructor(config) {
    super(config);

    this.action = config.action;
    this.type = config.type;
    this.options = { ...config.options };

    const EffectApplicator = applicatorOptions[this.type];

    if (EffectApplicator) {
      this.applicatorOptions = new EffectApplicator(config.applicatorOptions);
    }
  }

  clone() {
    return new Effect({
      action: this.action,
      type: this.type,
      options: this.options,
      applicatorOptions: this.applicatorOptions,
    });
  }
}

Effect.componentName = 'Effect';
