import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { withGame } from '../../../common';

import './style.css';

const FPS_UPDATE_MESSAGE = 'FPS_UPDATE';

export const FpsMeter = ({
  className,
  messageBusObserver,
}) => {
  const [ fps, setFps ] = useState(0);

  const onMessageBusUpdate = useCallback((messageBus) => {
    const messages = messageBus.get(FPS_UPDATE_MESSAGE);

    if (messages) {
      setFps(Math.round(messages[0].fps));
    }
  }, []);

  useEffect(() => {
    messageBusObserver.subscribe(onMessageBusUpdate);

    return () => messageBusObserver.unsubscribe(onMessageBusUpdate);
  }, []);

  return (
    <div className={`fps-meter ${className}`}>
      {fps} FPS
    </div>
  );
};

FpsMeter.defaultProps = {
  className: '',
};

FpsMeter.propTypes = {
  className: PropTypes.string,
  messageBusObserver: PropTypes.any,
};

export const WrappedFpsMeter = withGame(FpsMeter);
