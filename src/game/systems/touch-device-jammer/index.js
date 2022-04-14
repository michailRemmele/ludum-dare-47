import { isTouchDevice } from '../../../utils';

const INPUT_MESSAGE = 'MOUSE_INPUT_EVENT_QUERY';

export class TouchDeviceJammer {
  constructor(options) {
    this.messageBus = options.messageBus;
    this._isTouchDevice = isTouchDevice();
  }

  update() {
    if (!this._isTouchDevice) {
      return;
    }

    this.messageBus.delete(INPUT_MESSAGE);
  }
}
