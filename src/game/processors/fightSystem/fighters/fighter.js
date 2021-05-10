class Fighter {
  isReady() {
    throw new Error('You should override this function');
  }

  attack() {
    throw new Error('You should override this function');
  }

  process() {
    throw new Error('You should override this function');
  }
}

export default Fighter;
