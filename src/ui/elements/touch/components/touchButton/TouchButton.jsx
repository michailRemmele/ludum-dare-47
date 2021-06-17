import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { IconButton } from '../../../common';

import './style.css';

const TouchButton = ({
  className,
  onClick,
  ...props
}) => {
  const [ active, setActive ] = useState(false);

  const handlePointerUp = useCallback((event) => {
    setActive(false);
    onClick(event);
  }, [ onClick ]);

  const handlePointerDown = useCallback(() => setActive(true), []);

  return (
    <IconButton
      {...props}
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
