import { TouchDeviceJammer } from 'game/systems/touch-device-jammer';

export class TouchDeviceJammerPlugin {
  load(options) {
    return new TouchDeviceJammer({
      messageBus: options.messageBus,
    });
  }
}
