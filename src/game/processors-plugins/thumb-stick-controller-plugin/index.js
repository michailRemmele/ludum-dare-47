import ThumbStickController from 'game/processors/thumbStickController/thumbStickController';

const CONTROL_COMPONENT_NAME = 'thumbStickControl';

export class ThumbStickControllerPlugin {
  load(options) {
    return new ThumbStickController({
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          CONTROL_COMPONENT_NAME,
        ],
      }),
    });
  }
}
