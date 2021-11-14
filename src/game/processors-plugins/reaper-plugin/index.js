import Reaper from 'game/processors/reaper/reaper';

export class ReaperPlugin {
  load(options) {
    const {
      gameObjectDestroyer,
      allowedComponents,
      lifetime,
    } = options;

    return new Reaper({
      gameObjectDestroyer,
      allowedComponents,
      lifetime,
    });
  }
}
