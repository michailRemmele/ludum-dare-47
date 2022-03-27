import Reaper from 'game/processors/reaper/reaper';

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
