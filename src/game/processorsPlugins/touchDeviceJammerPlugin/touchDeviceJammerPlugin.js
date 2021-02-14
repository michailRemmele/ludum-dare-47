import { ProcessorPlugin } from '@flyer-engine/core';

import TouchDeviceJammer from 'game/processors/touchDeviceJammer/touchDeviceJammer';

class TouchDeviceJammerPlugin extends ProcessorPlugin {
  async load() {
    return new TouchDeviceJammer();
  }
}

export default TouchDeviceJammerPlugin;
