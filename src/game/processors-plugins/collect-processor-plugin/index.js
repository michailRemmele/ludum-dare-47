import CollectProcessor from 'game/processors/collectProcessor/collectProcessor';

const KEYBOARD_CONTROL_COMPONENT_NAME = 'keyboardControl';
const MOUSE_CONTROL_COMPONENT_NAME = 'mouseControl';

export class CollectProcessorPlugin {
  load(options) {
    return new CollectProcessor({
      gameObjectObserver: options.createGameObjectObserver({
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
