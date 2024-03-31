import React, { useCallback, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { IconButton } from '../../../common';

import './style.css';

const TouchButton = ({
  className,
  onClick,
  ...props
}) => {
  const buttonRef = useRef(null);

  const [ active, setActive ] = useState(false);

  useEffect(() => {
    if (!buttonRef.current) {
      return;
    }

    const handleTouchStart = (event) => event.preventDefault();
    const buttonInstance = buttonRef.current;

    buttonInstance.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => {
      buttonInstance.removeEventListener('touchstart', handleTouchStart);
    };
  }, [ buttonRef ]);

  const handlePointerUp = useCallback((event) => {
    setActive(false);
    onClick(event);
  }, [ onClick ]);

  const handlePointerDown = useCallback(() => setActive(true), []);

  return (
    <IconButton
      {...props}
      ref={buttonRef}
      className={`${className} ${active ? 'touch-button_active' : ''}`}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
    />
  );
};

TouchButton.defaultProps = {
  className: '',
  onClick: () => {},
};

TouchButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export const TouchButtonMemoized = React.memo(TouchButton);
