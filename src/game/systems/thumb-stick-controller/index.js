import { MathOps, System } from 'remiz';

import { ThumbStickControl } from '../../components';

const INPUT_MSG = 'THUMB_STICK_POSITION_CHANGE';

export class ThumbStickController extends System {
  constructor(options) {
    super();

    this._gameObjectObserver = options.createGameObjectObserver({
      components: [ ThumbStickControl ],
    });
    this.messageBus = options.messageBus;
    this._currentX = 0;
    this._currentY = 0;
    this._currentAngle = null;
  }

  update() {
    const messages = this.messageBus.get(INPUT_MSG) || [];
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
      const control = gameObject.getComponent(ThumbStickControl);
      const eventBinding = control.inputEventBindings[INPUT_MSG];

      if (eventBinding) {
        if (!eventBinding.messageType) {
          throw new Error(`The message type not specified for input event: ${INPUT_MSG}`);
        }

        this.messageBus.send({
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

ThumbStickController.systemName = 'ThumbStickController';
