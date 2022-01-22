import TouchDeviceJammer from 'game/processors/touchDeviceJammer/touchDeviceJammer';

export class TouchDeviceJammerPlugin {
  load(options) {
    return new TouchDeviceJammer({
      messageBus: options.messageBus,
    });
  }
}
