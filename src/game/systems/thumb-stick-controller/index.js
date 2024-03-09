import { ActorCollection, MathOps, System } from 'remiz';

import { EventType } from '../../../events';
import { ThumbStickControl } from '../../components';

export class ThumbStickController extends System {
  constructor(options) {
    super();

    this.actorCollection = new ActorCollection(options.scene, {
      components: [ ThumbStickControl ],
    });
    this.scene = options.scene;
    this._currentX = 0;
    this._currentY = 0;
    this._currentAngle = null;
  }

  mount() {
    this.scene.addEventListener(EventType.ThumbStickInput, this._handleInput);
  }

  unmount() {
    this.scene.removeEventListener(EventType.ThumbStickInput, this._handleInput);
  }

  _handleInput = (event) => {
    const { x, y } = event;

    this._currentX = x;
    this._currentY = y;

    this._currentAngle = (x || y)
      ? MathOps.radToDeg(MathOps.getAngleBetweenTwoPoints(x, 0, y, 0))
      : null;
  };

  update() {
    if (this._currentAngle === null) {
      return;
    }

    this.actorCollection.forEach((actor) => {
      const control = actor.getComponent(ThumbStickControl);
      const eventBinding = control.inputEventBindings[EventType.ThumbStickInput];

      if (eventBinding) {
        if (!eventBinding.eventType) {
          throw new Error(
            `The event type not specified for input event: ${EventType.ThumbStickInput}`
          );
        }

        actor.dispatchEvent(eventBinding.eventType, {
          ...eventBinding.attrs,
          x: this._currentX,
          y: this._currentY,
          angle: this._currentAngle,
        });
      }
    });
  }
}

ThumbStickController.systemName = 'ThumbStickController';
