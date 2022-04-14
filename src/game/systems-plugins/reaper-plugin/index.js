import { Reaper } from 'game/systems/reaper';

export class ReaperPlugin {
  load(options) {
    const {
      gameObjectDestroyer,
      allowedComponents,
      lifetime,
      messageBus,
    } = options;

    return new Reaper({
      gameObjectDestroyer,
      allowedComponents,
      lifetime,
      messageBus,
    });
  }
}
