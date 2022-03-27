import { isTouchDevice } from '../../../utils';

const INPUT_MESSAGE = 'MOUSE_INPUT_EVENT_QUERY';

class TouchDeviceJammer {
  constructor(options) {
    this.messageBus = options.messageBus;
    this._isTouchDevice = isTouchDevice();
  }

  process() {
    if (!this._isTouchDevice) {
      return;
    }

    this.messageBus.delete(INPUT_MESSAGE);
  }
}

export default TouchDeviceJammer;
