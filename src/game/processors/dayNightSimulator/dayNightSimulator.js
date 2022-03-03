import { Time, DAY_LENGTH_MS } from './time';

const TIME_OF_DAY_KEY = 'timeOfDay';
const LIGHT_COMPONENT_NAME = 'light';

const skyMiddayColor = {
  red: 255,
  green: 255,
  blue: 255,
};
const skySunsetColor = {
  red: 255,
  green: 100,
  blue: 60,
};
const skyTwilightColor = {
  red: 180,
  green: 120,
  blue: 200,
};
const skyMidnightColor = {
  red: 30,
  green: 128,
  blue: 255,
};

const skyPoints = [
  {
    color: skyMiddayColor,
    intensity: 1,
    time: { hours: 12, minutes: 0 },
  },
  {
    color: skyMiddayColor,
    intensity: 0.95,
    time: { hours: 19, minutes: 0 },
  },
  {
    color: skySunsetColor,
    intensity: 0.9,
    time: { hours: 20, minutes: 30 },
  },
  {
    color: skySunsetColor,
    intensity: 0.9,
    time: { hours: 21, minutes: 30 },
  },
  {
    color: skyTwilightColor,
    intensity: 0.8,
    time: { hours: 23, minutes: 0 },
  },
  {
    color: skyMidnightColor,
    intensity: 0.7,
    time: { hours: 0, minutes: 0 },
  },
  {
    color: skyMidnightColor,
    intensity: 0.75,
    time: { hours: 4, minutes: 0 },
  },
  {
    color: skyTwilightColor,
    intensity: 0.8,
    time: { hours: 5, minutes: 0 },
  },
  {
    color: skySunsetColor,
    intensity: 0.9,
    time: { hours: 6, minutes: 30 },
  },
  {
    color: skySunsetColor,
    intensity: 0.9,
    time: { hours: 7, minutes: 30 },
  },
  {
    color: skyMiddayColor,
    intensity: 0.95,
    time: { hours: 9, minutes: 0 },
  },
];

export const interpolate = (start, end, progress) => start + ((end - start) * progress);

class DayNightSimulator {
  constructor(options) {
    const {
      gameObjectObserver,
      store,
      messageBus,
      dayLength,
      startTime,
      skyId,
    } = options;

    this._store = store;
    this.messageBus = messageBus;

    this._dayLength = dayLength;
    this._startTime = startTime;

    this.sky = gameObjectObserver.getById(skyId);

    if (!this.sky) {
      throw new Error(`Could not find sky game object with id ${skyId}`);
    }

    this._time = null;

    this._startSegmentIndex = 0;
  }

  processorDidMount() {
    this._time = new Time(this._dayLength, this._startTime);
    this._store.set(TIME_OF_DAY_KEY, this._time);
  }

  _updateDaySegment() {
    const ms = this._time.getTotalMilliseconds();

    let startSegmentIndex;
    for (let i = 0; i < skyPoints.length; i += 1) {
      const skyPointTime = skyPoints[i].time;
      const skyPointMs = Time.timeToMilliseconds(skyPointTime.hours, skyPointTime.minutes);
      const prevSkyPointTime = skyPoints[i - 1]
        ? skyPoints[i - 1].time
        : skyPoints[skyPoints.length - 1].time;

      if (ms >= skyPointMs) {
        if (Number.isInteger(startSegmentIndex) && skyPointTime.hours < prevSkyPointTime.hours) {
          break;
        }

        startSegmentIndex = i;
      } else if (Number.isInteger(startSegmentIndex)) {
        break;
      }
    }

    if (Number.isInteger(startSegmentIndex) && startSegmentIndex !== this._startSegmentIndex) {
      this._startSegmentIndex = startSegmentIndex;
    }
  }

  _updateSkyColor() {
    const light = this.sky.getComponent(LIGHT_COMPONENT_NAME);

    const startPoint = skyPoints[this._startSegmentIndex];
    const endPoint = skyPoints[this._startSegmentIndex + 1]
      ? skyPoints[this._startSegmentIndex + 1]
      : skyPoints[0];

    const ms = this._time.getTotalMilliseconds();
    const startMs = Time.timeToMilliseconds(startPoint.time.hours, startPoint.time.minutes);
    const endMs = Time.timeToMilliseconds(endPoint.time.hours, endPoint.time.minutes);

    const duration = endMs > startMs ? endMs - startMs : DAY_LENGTH_MS + endMs - startMs;
    const passed = ms > startMs ? ms - startMs : DAY_LENGTH_MS + ms - startMs;

    const progress = passed / duration;

    light.options.intensity = interpolate(startPoint.intensity, endPoint.intensity, progress);

    const red = Math.round(interpolate(
      startPoint.color.red, endPoint.color.red, progress
    ));
    const green = Math.round(interpolate(
      startPoint.color.green, endPoint.color.green, progress
    ));
    const blue = Math.round(interpolate(
      startPoint.color.blue, endPoint.color.blue, progress
    ));
    light.options.color = `rgb(${red},${green},${blue})`;
  }

  process(options) {
    const { deltaTime } = options;

    this._time.tick(deltaTime);

    this._updateDaySegment();
    this._updateSkyColor();
  }
}

export default DayNightSimulator;
