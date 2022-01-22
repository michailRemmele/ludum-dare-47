import AutoAimingProcessor from 'game/processors/autoAimingProcessor/autoAimingProcessor';

const KEYBOARD_CONTROL_COMPONENT_NAME = 'keyboardControl';
const MOUSE_CONTROL_COMPONENT_NAME = 'mouseControl';

export class AutoAimingProcessorPlugin {
  load(options) {
    return new AutoAimingProcessor({
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          KEYBOARD_CONTROL_COMPONENT_NAME,
          MOUSE_CONTROL_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
