import TouchDeviceJammer from 'game/processors/touchDeviceJammer/touchDeviceJammer';

export class TouchDeviceJammerPlugin {
  load() {
    return new TouchDeviceJammer();
  }
}
