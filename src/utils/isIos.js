export const isIosSafari = () =>
  navigator.platform.toLowerCase() === 'iphone' &&
  navigator.userAgent.toLowerCase().includes('safari') &&
  !navigator.userAgent.toLowerCase().includes('crios') &&
  !navigator.userAgent.toLowerCase().includes('chrome');

export const isIos = () =>
  navigator.platform.toLowerCase() === 'iphone' &&
  navigator.userAgent.toLowerCase().includes('safari');
