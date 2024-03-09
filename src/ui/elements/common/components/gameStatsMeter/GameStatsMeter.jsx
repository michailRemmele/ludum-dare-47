import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { GameStatsUpdate } from 'remiz/events';

import { withGame } from '../../../common';

import './style.css';

const CHART_MAX_VALUES = 10;
const CHART_LINE_WIDTH = 8;
const CHART_WIDTH = 400;
const CHART_HEIGHT = 120;

const getPointX = (index) => {
  return index * CHART_WIDTH / CHART_MAX_VALUES;
};

const getPointY = (value, max) => {
  return (CHART_HEIGHT - ((CHART_HEIGHT * value) / max)) + (CHART_LINE_WIDTH / 2);
};

export const GameStatsMeter = ({
  className,
  scene,
}) => {
  const chartRef = useRef(null);
  const chartCtxRef = useRef(null);
  const chartValues = useRef([]);

  const [ fps, setFps ] = useState(0);
  const [ actorsCount, setActorsCount ] = useState(0);

  const updateChart = useCallback((currentFps) => {
    const ctx = chartCtxRef.current;
    const values = chartValues.current;

    values.push(currentFps);

    if (values.length > CHART_MAX_VALUES) {
      values.shift();
    }

    ctx.clearRect(0, 0, CHART_WIDTH, CHART_HEIGHT);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = CHART_LINE_WIDTH;

    ctx.beginPath();

    const max = Math.max(...values);

    ctx.moveTo(getPointX(values.length - 1), CHART_HEIGHT + CHART_LINE_WIDTH);

    ctx.lineTo(-CHART_LINE_WIDTH, CHART_HEIGHT + CHART_LINE_WIDTH);
    ctx.lineTo(-CHART_LINE_WIDTH, getPointY(values[0], max));
    values.forEach((value, index) => {
      ctx.lineTo(getPointX(index), getPointY(value, max));
    });

    ctx.fill();
    ctx.stroke();
  }, []);

  useEffect(() => {
    const handleGameStateUpdate = (event) => {
      const currentFps = Math.round(event.fps);

      setActorsCount(event.actorsCount);

      setFps(currentFps);
      updateChart(currentFps);
    };

    scene.addEventListener(GameStatsUpdate, handleGameStateUpdate);

    return () => scene.removeEventListener(GameStatsUpdate, handleGameStateUpdate);
  }, [ scene ]);

  useEffect(() => {
    chartCtxRef.current = chartRef.current.getContext('2d');
  }, []);

  return (
    <div className={`game-stats-meter ${className}`}>
      <div className='game-stats-meter__details'>
        <span className='game-stats-meter__fps'>
          {`${fps} FPS`}
        </span>

        <div className='game-stats-meter__load'>
          <span className='game-stats-meter__additional'>
            {`Game objects: ${actorsCount}`}
          </span>
        </div>
      </div>

      <canvas
        ref={chartRef}
        className='game-stats-meter__chart'
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
      ></canvas>
    </div>
  );
};

GameStatsMeter.defaultProps = {
  className: '',
};

GameStatsMeter.propTypes = {
  className: PropTypes.string,
  scene: PropTypes.any,
};

export const WrappedGameStatsMeter = withGame(GameStatsMeter);
