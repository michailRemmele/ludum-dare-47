import { ThumbStickController } from 'game/systems/thumb-stick-controller';

const CONTROL_COMPONENT_NAME = 'thumbStickControl';

export class ThumbStickControllerPlugin {
  load(options) {
    return new ThumbStickController({
      entityObserver: options.createEntityObserver({
        components: [
          CONTROL_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
