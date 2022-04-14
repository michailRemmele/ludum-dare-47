import { DayNightSimulator } from 'game/systems/day-night-simulator';

const LIGHT_COMPONENT_NAME = 'light';

export class DayNightSimulatorPlugin {
  load(options) {
    const {
      createGameObjectObserver,
      store,
      messageBus,
      dayLength,
      startTime,
      skyId,
    } = options;

    return new DayNightSimulator({
      gameObjectObserver: createGameObjectObserver({
        components: [ LIGHT_COMPONENT_NAME ],
      }),
      store,
      messageBus,
      dayLength,
      startTime,
      skyId,
    });
  }
}
