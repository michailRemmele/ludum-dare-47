import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import './style.css';

export const ActionView = React.forwardRef(({
  className,
  stopPropagate,
  onDoubleClick,
  onContextMenu,
  onMouseUp,
  onMouseDown,
  onClick,
  onPointerUp,
  onPointerDown,
  children,
  ...props
}, ref) => {
  const handleStopPropagate = useCallback((event) => {
    if (!stopPropagate) {
      return;
    }
    event.stopPropagation();
  }, [ stopPropagate ]);

  const handleDoubleClick = useCallback((event) => {
    if (!onDoubleClick) {
      handleStopPropagate(event);
    } else {
      onDoubleClick(event);
    }
  }, [ onDoubleClick ]);

  const handleContextMenu = useCallback((event) => {
    if (!onContextMenu) {
      event.preventDefault();
      handleStopPropagate(event);
    } else {
      onContextMenu(event);
    }
  }, [ onContextMenu ]);

  const handleMouseUp = useCallback((event) => {
    if (!onMouseUp) {
      handleStopPropagate(event);
    } else {
      onMouseUp(event);
    }
  }, [ onMouseUp ]);

  const handleMouseDown = useCallback((event) => {
    if (!onMouseDown) {
      handleStopPropagate(event);
    } else {
      onMouseDown(event);
    }
  }, [ onMouseDown ]);

  const handleClick = useCallback((event) => {
    if (!onClick) {
      handleStopPropagate(event);
    } else {
      onClick(event);
    }
  }, [ onClick ]);

  const handlePointerUp = useCallback((event) => {
    if (!onPointerUp) {
      handleStopPropagate(event);
    } else {
      onPointerUp(event);
    }
  }, [ onPointerUp ]);

  const handlePointerDown = useCallback((event) => {
    if (!onPointerDown) {
      handleStopPropagate(event);
    } else {
      onPointerDown(event);
    }
  }, [ onPointerDown ]);

  return (
    <button
      {...props}
      ref={ref}
      className={`action-view ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {children}
    </button>
  );
});

ActionView.defaultProps = {
  className: '',
  stopPropagate: false,
};

ActionView.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onContextMenu: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onClick: PropTypes.func,
  onPointerUp: PropTypes.func,
  onPointerDown: PropTypes.func,
  stopPropagate: PropTypes.bool,
};

ActionView.displayName = 'ActionView';
