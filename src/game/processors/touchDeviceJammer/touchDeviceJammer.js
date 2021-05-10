import { Processor } from '@flyer-engine/core';

import { isTouchDevice } from '../../../utils';

const INPUT_MESSAGE = 'MOUSE_INPUT_EVENT_QUERY';

class TouchDeviceJammer extends Processor {
  constructor() {
    super();

    this._isTouchDevice = isTouchDevice();
  }

  process(options) {
    if (!this._isTouchDevice) {
      return;
    }

    const messageBus = options.messageBus;

    messageBus.delete(INPUT_MESSAGE);
  }
}

export default TouchDeviceJammer;
