class Attack {
  isFinished() {
    throw new Error('You should override this function');
  }

  process() {
    throw new Error('You should override this function');
  }
}

export default Attack;
