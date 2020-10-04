const DAY_LENGTH_MS = 86400000;

class Time {
  constructor(dayLength, startTime) {
    this._dayLength = dayLength;
    this._startTime = startTime;

    this._factor = DAY_LENGTH_MS / this._dayLength;

    this._currentTime = this._startTime / this._factor;
  }

  tick(deltaTime) {
    this._currentTime = (this._currentTime + deltaTime) % this._dayLength;
  }

  getTotalSeconds() {
    return this.getTotalMilliseconds() / 1000;
  }

  getTotalMilliseconds() {
    return this._currentTime * this._factor;
  }

  getHours() {
    return Math.floor(this.getTotalMilliseconds() / 3600000);
  }

  getMinutes() {
    return Math.floor((this.getTotalMilliseconds() % 3600000) / 60000);
  }

  getSeconds() {
    return Math.floor((this.getTotalMilliseconds() % 60000) / 1000);
  }
}

export default Time;
