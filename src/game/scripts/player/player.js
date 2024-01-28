import {
  Transform,
  Script,
  MathOps,
  Light,
  MouseInput,
  CollisionEnter,
  CollisionStay,
  CollisionLeave,
} from 'remiz';

import {
  HitBox,
  AutoAim,
  Collectable,
} from '../../components';
import { EventType } from '../../../events';
import { isTouchDevice } from '../../../utils';

import { CollectService } from './service';

const HEAL_EFFECT = {
  effectId: 'a1510c63-6925-459c-9442-10902ed829f0',
  options: {
    value: 50,
  },
};

const POWER_EFFECT = {
  effectId: '20e63f34-e52b-445b-b722-685628be2fd7',
  options: {
    damage: 80,
    range: 15,
  },
};

const ITEM_EFFECTS = {
  healPotion: HEAL_EFFECT,
  powerPotion: POWER_EFFECT,
};

export class PlayerScript extends Script {
  constructor({
    scene,
    gameObject,
    gameObjectObserver,
    skyId,
    threshold,
  }) {
    super();

    this.scene = scene;
    this.gameObject = gameObject;
    this.autoAimObject = gameObject.getChildren().find(
      (child) => child.getComponent(AutoAim)
    );
    this.sky = gameObjectObserver.getById(skyId);
    this.threshold = threshold;

    this.collectService = new CollectService();
    scene.context.registerService(this.collectService);

    this.gameObject.addEventListener(CollisionEnter, this._handleCollisionEnter);
    this.gameObject.addEventListener(CollisionLeave, this._handleCollisionLeave);
    this.gameObject.addEventListener(EventType.Grab, this._handleGrabItem);
    this.gameObject.addEventListener(EventType.UseItem, this._handleUseItem);
    this.gameObject.addEventListener(EventType.CraftRecipe, this._handleCraftItem);

    // Ignore mouse events for touch devices and enable auto aim
    if (isTouchDevice()) {
      this.gameObject.removeComponent(MouseInput);
      this.autoAimObject.addEventListener(CollisionStay, this._handleCollisionStay);
    }

    this.nearestTargetDistance = Infinity;
  }

  destroy() {
    this.gameObject.removeEventListener(CollisionEnter, this._handleCollisionEnter);
    this.gameObject.removeEventListener(CollisionLeave, this._handleCollisionLeave);
    this.gameObject.removeEventListener(EventType.Grab, this._handleGrabItem);
    this.gameObject.removeEventListener(EventType.UseItem, this._handleUseItem);
    this.gameObject.removeEventListener(EventType.CraftRecipe, this._handleCraftItem);

    this.autoAimObject.removeEventListener(CollisionStay, this._handleCollisionStay);

    this.scene.emit(EventType.Defeat);
  }

  _handleCollisionEnter = (event) => {
    const { gameObject } = event;

    const collectableItems = this.collectService.getCollectableItems();
    const collectable = gameObject.getComponent(Collectable);

    if (!collectable) {
      return;
    }

    collectableItems.add(gameObject);
  };

  _handleCollisionLeave = (event) => {
    const { gameObject } = event;

    const collectableItems = this.collectService.getCollectableItems();

    if (collectableItems.has(gameObject)) {
      collectableItems.delete(gameObject);
    }
  };

  _handleCollisionStay = (event) => {
    const { gameObject } = event;

    const hitBox = gameObject.getComponent(HitBox);
    const targetParent = gameObject.parent;

    if (!hitBox || this.gameObject.id === targetParent.id) {
      return;
    }

    const { offsetX, offsetY } = this.gameObject.getComponent(Transform);

    const {
      offsetX: targetX,
      offsetY: targetY,
    } = gameObject.getComponent(Transform);

    const distance = MathOps.getDistanceBetweenTwoPoints(offsetX, targetX, offsetY, targetY);

    if (distance < this.nearestTargetDistance) {
      this.nearestTargetDistance = distance;

      const autoAim = this.autoAimObject.getComponent(AutoAim);
      autoAim.targetX = targetX;
      autoAim.targetY = targetY;
    }
  };

  _handleGrabItem = () => {
    const collectableItems = this.collectService.getCollectableItems();

    if (!collectableItems.size) {
      return;
    }

    const item = collectableItems.values().next().value;
    const collectable = item.getComponent(Collectable);

    if (!collectable) {
      return;
    }

    const name = collectable.name;

    const inventory = this.collectService.getInventory();

    inventory[name] = inventory[name] || 0;
    inventory[name] += 1;

    collectableItems.delete(item);

    item.emit(EventType.Kill);
  };

  _handleUseItem = (event) => {
    const { item } = event;
    const inventory = this.collectService.getInventory();

    if (!inventory[item]) {
      return;
    }

    inventory[item] -= 1;

    this.gameObject.emit(EventType.AddEffect, ITEM_EFFECTS[item]);
  };

  _handleCraftItem = (event) => {
    const { recipe } = event;
    const inventory = this.collectService.getInventory();

    if (!inventory[recipe.resource] || inventory[recipe.resource] < recipe.cost) {
      return;
    }

    inventory[recipe.resource] -= recipe.cost;
    inventory[recipe.name] = inventory[recipe.name] || 0;
    inventory[recipe.name] += 1;
  };

  _updateLight() {
    const skyLight = this.sky.getComponent(Light);
    const playerLight = this.gameObject.getComponent(Light);

    playerLight.options.intensity = MathOps.clamp(
      this.threshold - skyLight.options.intensity,
      0,
      this.threshold
    );
  }

  update() {
    this._updateLight();
  }
}

PlayerScript.scriptName = 'PlayerScript';
