export class DelayedEffectOptions {
  constructor(options) {
    this._timer = options.timer;
  }

  set timer(timer) {
    this._timer = timer;
  }

  get timer() {
    return this._timer;
  }
}
