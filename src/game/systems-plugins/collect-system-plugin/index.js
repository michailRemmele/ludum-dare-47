import { CollectSystem } from 'game/systems/collect-system';

const KEYBOARD_CONTROL_COMPONENT_NAME = 'keyboardControl';
const MOUSE_CONTROL_COMPONENT_NAME = 'mouseControl';

export class CollectSystemPlugin {
  load(options) {
    return new CollectSystem({
      entityObserver: options.createEntityObserver({
        components: [
          KEYBOARD_CONTROL_COMPONENT_NAME,
          MOUSE_CONTROL_COMPONENT_NAME,
        ],
      }),
      store: options.store,
      messageBus: options.messageBus,
    });
  }
}
