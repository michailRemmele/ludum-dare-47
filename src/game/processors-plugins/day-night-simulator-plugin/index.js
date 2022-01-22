import DayNightSimulator from 'game/processors/dayNightSimulator/dayNightSimulator';

export class DayNightSimulatorPlugin {
  load(options) {
    const {
      store,
      dayLength,
      startTime,
      messageBus,
    } = options;

    return new DayNightSimulator({
      store,
      dayLength,
      startTime,
      messageBus,
    });
  }
}
