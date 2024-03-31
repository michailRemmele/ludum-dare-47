export class TimeService {
  constructor({ time }) {
    this.time = time;
  }

  getDays() {
    return this.time.getDays();
  }

  getHours() {
    return this.time.getHours();
  }

  getMinutes() {
    return this.time.getMinutes();
  }

  getSeconds() {
    return this.time.getSeconds();
  }
}
