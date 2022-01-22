import Time from './time';

const TIME_OF_DAY_KEY = 'timeOfDay';

const SET_COLOR_FILTER_MSG = 'SET_COLOR_FILTER';

const COLOR_MAT_0_3 = [
  0.4, 0.0, 0.2, 0.0,
  0.0, 0.4, 0.4, 0.0,
  0.0, 0.0, 0.4, 0.0,
  0.0, 0.0, 0.0, 1.0,
];
const COLOR_MAT_3_6 = [
  0.5, 0.0, 0.0, 0.0,
  0.0, 0.5, 0.4, 0.0,
  0.0, 0.0, 0.5, 0.0,
  0.0, 0.0, 0.0, 1.0,
];
const COLOR_MAT_6_9 = [
  0.8, 0.0, 0.0, 0.0,
  0.0, 0.8, 0.0, 0.0,
  0.0, 0.0, 0.8, 0.0,
  0.0, 0.0, 0.0, 1.0,
];
const COLOR_MAT_9_18 = [
  1.0, 0.0, 0.0, 0.0,
  0.0, 1.0, 0.0, 0.0,
  0.0, 0.0, 1.0, 0.0,
  0.0, 0.0, 0.0, 1.0,
];
const COLOR_MAT_18_21 = [
  1.0, 0.0, 0.0, 0.0,
  0.3, 1.0, 0.0, 0.0,
  0.0, 0.0, 0.7, 0.0,
  0.0, 0.0, 0.0, 1.0,
];
const COLOR_MAT_21_0 = [
  0.8, 0.0, 0.0, 0.0,
  0.5, 0.8, 0.0, 0.0,
  0.0, 0.0, 0.7, 0.0,
  0.0, 0.0, 0.0, 1.0,
];

class DayNightSimulator {
  constructor(options) {
    this._dayLength = options.dayLength;
    this._startTime = options.startTime;
    this._store = options.store;
    this.messageBus = options.messageBus;

    this._time = null;

    this._schedule = [
      COLOR_MAT_0_3,
      COLOR_MAT_3_6,
      COLOR_MAT_6_9,
      COLOR_MAT_9_18,
      COLOR_MAT_9_18,
      COLOR_MAT_9_18,
      COLOR_MAT_18_21,
      COLOR_MAT_21_0,
    ];
    this._currentFilterIndex = null;
  }

  processorDidMount() {
    this._time = new Time(this._dayLength, this._startTime);
    this._store.set(TIME_OF_DAY_KEY, this._time);
  }

  _updateColorFilter() {
    const hours = this._time.getHours();

    const newIndex = Math.floor(hours / 3);

    if (newIndex !== this._currentFilterIndex) {
      this._currentFilterIndex = Math.floor(hours / 3);

      this.messageBus.send({
        type: SET_COLOR_FILTER_MSG,
        filter: this._schedule[this._currentFilterIndex],
      });
    }
  }

  process(options) {
    const { deltaTime } = options;

    this._time.tick(deltaTime);

    this._updateColorFilter();
  }
}

export default DayNightSimulator;
