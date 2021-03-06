import { Processor, MathOps } from '@flyer-engine/core';

const CONTROL_COMPONENT_NAME = 'thumbStickControl';

const INPUT_MSG = 'THUMB_STICK_POSITION_CHANGE';

class ThumbStickController extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._currentX = 0;
    this._currentY = 0;
    this._currentAngle = null;
  }

  process(options) {
    const messageBus = options.messageBus;

    const messages = messageBus.get(INPUT_MSG) || [];
    messages.forEach((message) => {
      const { x, y } = message;

      this._currentX = x;
      this._currentY = y;

      this._currentAngle = (x || y)
        ? MathOps.radToDeg(MathOps.getAngleBetweenTwoPoints(x, 0, y, 0))
        : null;
    });

    if (this._currentAngle === null) {
      return;
    }

    this._gameObjectObserver.forEach((gameObject) => {
      const control = gameObject.getComponent(CONTROL_COMPONENT_NAME);
      const eventBinding = control.inputEventBindings[INPUT_MSG];

      if (eventBinding) {
        if (!eventBinding.messageType) {
          throw new Error(`The message type not specified for input event: ${INPUT_MSG}`);
        }

        messageBus.send({
          type: eventBinding.messageType,
          ...eventBinding.attrs,
          gameObject: gameObject,
          id: gameObject.getId(),
          x: this._currentX,
          y: this._currentY,
          angle: this._currentAngle,
        });
      }
    });
  }
}

export default ThumbStickController;
