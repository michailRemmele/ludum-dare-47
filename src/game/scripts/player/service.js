export class CollectService {
  constructor() {
    this.canGrab = new Set();
    this.inventory = {};
  }

  getCollectableItems() {
    return this.canGrab;
  }

  getInventory() {
    return this.inventory;
  }
}
