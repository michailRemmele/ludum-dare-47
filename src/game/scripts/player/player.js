import {
  Transform,
  Script,
  MathOps,
  Light,
  MouseControl,
} from 'remiz';
import { CollisionEnter, CollisionStay, CollisionLeave } from 'remiz/events';

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
    actor,
    skyId,
    threshold,
  }) {
    super();

    this.scene = scene;
    this.actor = actor;
    this.autoAimObject = actor.children.find(
      (child) => child.getComponent(AutoAim)
    );
    this.sky = scene.getEntityById(skyId);
    this.threshold = threshold;

    this.collectService = new CollectService();
    scene.addService(this.collectService);

    this.actor.addEventListener(CollisionEnter, this._handleCollisionEnter);
    this.actor.addEventListener(CollisionLeave, this._handleCollisionLeave);
    this.actor.addEventListener(EventType.Grab, this._handleGrabItem);
    this.actor.addEventListener(EventType.UseItem, this._handleUseItem);
    this.actor.addEventListener(EventType.CraftRecipe, this._handleCraftItem);

    // Ignore mouse events for touch devices and enable auto aim
    if (isTouchDevice()) {
      this.actor.removeComponent(MouseControl);
      this.autoAimObject.addEventListener(CollisionStay, this._handleCollisionStay);
    }

    this.nearestTargetDistance = Infinity;
  }

  destroy() {
    this.actor.removeEventListener(CollisionEnter, this._handleCollisionEnter);
    this.actor.removeEventListener(CollisionLeave, this._handleCollisionLeave);
    this.actor.removeEventListener(EventType.Grab, this._handleGrabItem);
    this.actor.removeEventListener(EventType.UseItem, this._handleUseItem);
    this.actor.removeEventListener(EventType.CraftRecipe, this._handleCraftItem);

    this.autoAimObject.removeEventListener(CollisionStay, this._handleCollisionStay);

    this.scene.dispatchEvent(EventType.Defeat);
  }

  _handleCollisionEnter = (event) => {
    const { actor, target } = event;

    const collectableItems = this.collectService.getCollectableItems();
    const collectable = actor.getComponent(Collectable);

    if (target !== this.actor || !collectable) {
      return;
    }

    collectableItems.add(actor);
  };

  _handleCollisionLeave = (event) => {
    const { actor, target } = event;

    const collectableItems = this.collectService.getCollectableItems();

    if (target !== this.actor || collectableItems.has(actor)) {
      collectableItems.delete(actor);
    }
  };

  _handleCollisionStay = (event) => {
    const { actor, target } = event;

    const hitBox = actor.getComponent(HitBox);
    const targetParent = actor.parent;

    if (target !== this.actor || !hitBox || this.actor.id === targetParent.id) {
      return;
    }

    const { offsetX, offsetY } = this.actor.getComponent(Transform);

    const {
      offsetX: targetX,
      offsetY: targetY,
    } = actor.getComponent(Transform);

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

    item.dispatchEvent(EventType.Kill);
  };

  _handleUseItem = (event) => {
    const { item } = event;
    const inventory = this.collectService.getInventory();

    if (!inventory[item]) {
      return;
    }

    inventory[item] -= 1;

    this.actor.dispatchEvent(EventType.AddEffect, ITEM_EFFECTS[item]);
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
    const playerLight = this.actor.getComponent(Light);

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
