export class TimeLimitedEffectOptions {
  constructor(options) {
    this._duration = options.duration;
  }

  set duration(duration) {
    this._duration = duration;
  }

  get duration() {
    return this._duration;
  }
}
