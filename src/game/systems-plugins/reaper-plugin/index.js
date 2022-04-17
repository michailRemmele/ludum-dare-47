import { Reaper } from 'game/systems/reaper';

export class ReaperPlugin {
  load(options) {
    const {
      entityDestroyer,
      allowedComponents,
      lifetime,
      messageBus,
    } = options;

    return new Reaper({
      entityDestroyer,
      allowedComponents,
      lifetime,
      messageBus,
    });
  }
}
