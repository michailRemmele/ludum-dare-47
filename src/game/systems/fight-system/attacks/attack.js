class Attack {
  isFinished() {
    throw new Error('You should override this function');
  }

  update() {
    throw new Error('You should override this function');
  }
}

export default Attack;
