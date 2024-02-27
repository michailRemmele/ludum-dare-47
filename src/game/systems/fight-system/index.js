import {
  ActorCollection,
  MathOps,
  System,
  Transform,
  RemoveActor,
} from 'remiz';

import { EventType } from '../../../events';
import { Weapon } from '../../components';

import { SimpleFighter } from './fighters';

export class FightSystem extends System {
  constructor(options) {
    super();

    this.scene = options.scene;
    this.actorCollection = new ActorCollection(options.scene, {
      components: [ Weapon ],
    });
    this.actorSpawner = options.actorSpawner;

    this._fighters = {};
    this._activeAttacks = [];

    this._events = [];
  }

  mount() {
    this.scene.addEventListener(EventType.Attack, this._handleAttack);
    this.actorCollection.addEventListener(RemoveActor, this._handleRemoveActor);
  }

  unmount() {
    this.scene.removeEventListener(EventType.Attack, this._handleAttack);
    this.actorCollection.removeEventListener(RemoveActor, this._handleRemoveActor);
  }

  _handleRemoveActor = (event) => {
    delete this._fighters[event.actor.id];
  };

  _handleAttack = (event) => {
    this._events.push(event);
  };

  _updateActiveAttacks(deltaTime) {
    this._activeAttacks = this._activeAttacks.filter((attack) => {
      attack.update(deltaTime);

      if (attack.isFinished()) {
        attack.destroy();
      }

      return !attack.isFinished();
    });
  }

  _updateFighters(deltaTime) {
    this.actorCollection.forEach((actor) => {
      if (!this._fighters[actor.id]) {
        this._fighters[actor.id] = new SimpleFighter(
          actor, this.actorSpawner, this.scene
        );
      } else {
        this._fighters[actor.id].update(deltaTime);
      }
    });
  }

  _updateNewAttacks() {
    this._events.forEach((event) => {
      const { x, y, target } = event;

      const { offsetX, offsetY } = target.getComponent(Transform);

      const fighter = this._fighters[target.id];

      if (!fighter || !fighter.isReady()) {
        return;
      }

      const radAngle = MathOps.getAngleBetweenTwoPoints(x, offsetX, y, offsetY);

      const attack = fighter.attack(radAngle);

      this._activeAttacks.push(attack);
    });
    this._events = [];
  }

  update(options) {
    const { deltaTime } = options;

    this._updateFighters(deltaTime);
    this._updateActiveAttacks(deltaTime);

    this._updateNewAttacks();
  }
}

FightSystem.systemName = 'FightSystem';
