const UI_ROOT_DEADZONE_MOD = 'ui-root_deadzone';

export const applyIosSafariScreenFix = () => {
  let oldWidth = window.innerWidth;
  let oldHeight = window.innerHeight;

  const uiRoot = document.getElementById('ui-root');

  /**
   * This hack fixes interaction with app via control buttons
   * after user's exit from minimal ui mode and browser displays address bar
   */
  window.addEventListener('resize', () => {
    if (
      oldWidth === window.innerWidth &&
      oldHeight !== window.innerHeight &&
      Number(window.innerWidth) > Number(window.innerHeight)
    ) {
      document.body.style.height = '100vh';
      document.body.style.position = 'static';

      uiRoot.classList.remove(UI_ROOT_DEADZONE_MOD);

      setTimeout(() => {
        document.body.style = '';
      }, 100);
    }

    oldWidth = window.innerWidth;
    oldHeight = window.innerHeight;
  });

  /**
   * This hack sets correct screen height after user return back to app
   * by closing other tabs in browser
   */
  document.addEventListener('visibilitychange', () => {
    if (
      document.visibilityState === 'visible' &&
      oldWidth === window.innerWidth &&
      oldHeight === window.innerHeight &&
      Number(window.innerWidth) > Number(window.innerHeight)
    ) {
      setTimeout(() => {
        document.body.style.height = `${document.documentElement.clientHeight}px`;
        window.dispatchEvent(new Event('resize'));
      }, 500);
    }
  });

  /**
   * This hack triggers extra resize event to update canvas and control buttons after device rotate
   * This needs because the browser's native resize have incorrect window size
   */
  const orientation = window.matchMedia('(orientation:landscape)');
  orientation.addEventListener('change', (event) => {
    if (event.matches) {
      setTimeout(() => {
        oldWidth = window.innerWidth;
        oldHeight = window.innerHeight;

        window.dispatchEvent(new Event('resize'));
      }, 500);

      uiRoot.classList.add(UI_ROOT_DEADZONE_MOD);
    } else {
      document.body.style = '';

      uiRoot.classList.remove(UI_ROOT_DEADZONE_MOD);
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
