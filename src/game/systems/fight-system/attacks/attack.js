export class Attack {
  isFinished() {
    throw new Error('You should override this function');
  }

  destroy() {
    throw new Error('You should override this function');
  }

  update() {
    throw new Error('You should override this function');
  }
}
