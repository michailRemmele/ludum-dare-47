export class PeriodicalEffectOptions {
  constructor(options) {
    this._frequency = options.frequency;
    this._duration = options.duration;
  }

  set frequency(frequency) {
    this._frequency = frequency;
  }

  get frequency() {
    return this._frequency;
  }

  set duration(duration) {
    this._duration = duration;
  }

  get duration() {
    return this._duration;
  }
}
