export class Fighter {
  isReady() {
    throw new Error('You should override this function');
  }

  attack() {
    throw new Error('You should override this function');
  }

  update() {
    throw new Error('You should override this function');
  }
}
