export const applyIosSafariScreenFix = () => {
  /**
   * This hack updated body size after device rotate
   */
  const orientation = window.matchMedia('(orientation:landscape)');
  orientation.addEventListener('change', (event) => {
    if (event.matches) {
      document.body.style.width = `${window.innerWidth}px`;
      document.body.style.height = `${window.innerHeight}px`;
    } else {
      document.body.style = '';

      setTimeout(() => {
        document.body.style.height = `${document.documentElement.clientHeight}px`;

        setTimeout(() => {
          document.body.style = '';
        }, 100);
      }, 500);
    }
  });
};

export const applyIosChromeScreenFix = () => {
  /**
   * This hack triggers extra resize event to update canvas and control buttons
   * after user leaves app, rotates device and returns back
   */
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 500);
    }
  });
};
