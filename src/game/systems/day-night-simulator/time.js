export const DAY_LENGTH_MS = 86400000;
export const HOUR_LENGTH_MS = 3600000;
export const MINUTE_LENGTH_MS = 60000;

export class Time {
  constructor(dayLength, startTime) {
    this._dayLength = dayLength;
    this._startTime = startTime;

    this._factor = DAY_LENGTH_MS / this._dayLength;

    this._currentTime = this._startTime / this._factor;
    this._days = 0;
  }

  static timeToMilliseconds(hours, minutes) {
    return (hours * HOUR_LENGTH_MS) + (minutes * MINUTE_LENGTH_MS);
  }

  tick(deltaTime) {
    this._currentTime = this._currentTime + deltaTime;

    if (this._currentTime >= this._dayLength) {
      this._days += 1;
    }

    this._currentTime = this._currentTime % this._dayLength;
  }

  getTotalSeconds() {
    return this.getTotalMilliseconds() / 1000;
  }

  getTotalMilliseconds() {
    return this._currentTime * this._factor;
  }

  getDays() {
    return this._days;
  }

  getHours() {
    return Math.floor(this.getTotalMilliseconds() / HOUR_LENGTH_MS);
  }

  getMinutes() {
    return Math.floor((this.getTotalMilliseconds() % HOUR_LENGTH_MS) / MINUTE_LENGTH_MS);
  }

  getSeconds() {
    return Math.floor((this.getTotalMilliseconds() % MINUTE_LENGTH_MS) / 1000);
  }
}
