import { AutoAimingSystem } from 'game/systems/auto-aiming-system';

const KEYBOARD_CONTROL_COMPONENT_NAME = 'keyboardControl';
const MOUSE_CONTROL_COMPONENT_NAME = 'mouseControl';

export class AutoAimingSystemPlugin {
  load(options) {
    return new AutoAimingSystem({
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
