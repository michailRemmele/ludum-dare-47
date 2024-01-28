import {
  GameObject,
  GameObjectObserver,
  MathOps,
  System,
  Transform,
  AddGameObject,
  RemoveGameObject,
} from 'remiz';

import { EventType } from '../../../events';
import { Weapon } from '../../components';

import { SimpleFighter } from './fighters';

export class FightSystem extends System {
  constructor(options) {
    super();

    this.gameObjectObserver = new GameObjectObserver(options.scene, {
      components: [ Weapon ],
    });
    this.gameObjectSpawner = options.gameObjectSpawner;

    this._fighters = {};
    this._activeAttacks = [];

    this._events = [];
  }

  mount() {
    this.gameObjectObserver.forEach(this._handleAddGameObject);
    this.gameObjectObserver.addEventListener(AddGameObject, this._handleAddGameObject);
    this.gameObjectObserver.addEventListener(RemoveGameObject, this._handleRemoveGameObject);
  }

  unmount() {
    this.gameObjectObserver.forEach(this._handleRemoveGameObject);
    this.gameObjectObserver.removeEventListener(AddGameObject, this._handleAddGameObject);
    this.gameObjectObserver.removeEventListener(RemoveGameObject, this._handleRemoveGameObject);
  }

  _handleAddGameObject = (value) => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.addEventListener(EventType.Attack, this._handleAttack);
  };

  _handleRemoveGameObject = (value) => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.removeEventListener(EventType.Attack, this._handleAttack);

    delete this._fighters[gameObject.id];
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
    this.gameObjectObserver.forEach((gameObject) => {
      if (!this._fighters[gameObject.id]) {
        this._fighters[gameObject.id] = new SimpleFighter(
          gameObject, this.gameObjectSpawner
        );
      } else {
        this._fighters[gameObject.id].update(deltaTime);
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
