import React from 'react';
import PropTypes from 'prop-types';
import { Vector2, MathOps } from '@flyer-engine/core';

import { withGame } from '../../../common';

import './style.css';

const THUMB_STICK_POSITION_CHANGE_MSG = 'THUMB_STICK_POSITION_CHANGE';
const ANIMATION_STEP_FACTOR = 0.1;

const CONTROL_RADIUS = 0.4;

export class ThumbStick extends React.Component {
  constructor(props) {
    super(props);

    this.areaRef = React.createRef();

    this.state = {
      areaPosition: {},
      directionX: 0,
      directionY: 0,
    };
  }

  componentDidMount() {
    this.initCanvas();
    this.updateArea();

    window.addEventListener('resize', this.updateArea);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateArea);
  }

  initCanvas = () => {
    this.canvas = document.getElementById('thumb-stick__control');
    this.canvasCtx = this.canvas.getContext('2d');
  }

  resizeCanvas = () => {
    const { areaRadius } = this.state;
    const canvasPadding = areaRadius * CONTROL_RADIUS;
    const size = (areaRadius + canvasPadding) * 2;

    this.canvas.width = size;
    this.canvas.height = size;

    this.canvas.style.top = `${-canvasPadding}px`;
    this.canvas.style.left = `${-canvasPadding}px`;
  }

  updateCanvas = (x = 0, y = 0) => {
    const { areaRadius } = this.state;
    const controlRadius = areaRadius * CONTROL_RADIUS;

    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvasCtx.fillStyle = 'white';

    this.canvasCtx.beginPath();
    this.canvasCtx.arc(
      x + areaRadius + controlRadius,
      y + areaRadius + controlRadius,
      controlRadius,
      0,
      360
    );
    this.canvasCtx.fill();
  }

  updateArea = () => {
    const { left, right, top, bottom, width } = this.areaRef.current.getBoundingClientRect();

    this.setState({
      areaRadius: width / 2,
      areaX: (left + right) / 2,
      areaY: (top + bottom) / 2,
      animationStep: width * ANIMATION_STEP_FACTOR,
    }, () => {
      this.resizeCanvas();
      this.updateCanvas();
    });
  }

  moveStick = (event) => {
    const { areaRadius, areaX, areaY } = this.state;

    const direction = new Vector2(event.clientX - areaX, event.clientY - areaY);
    const magnitude = direction.magnitude;

    if (magnitude > areaRadius) {
      direction.multiplyNumber(areaRadius / magnitude);
    }

    this.updateCanvas(direction.x, direction.y);

    direction.multiplyNumber(1 / areaRadius);

    this.onMove(direction.x, direction.y);
  }

  resetStick = () => {
    this.setState({
      areaPosition: {},
    }, this.updateArea);

    this.onMove(0, 0);
  }

  onPointerMove = (event) => {
    this.moveStick(event);
  }

  onPointerDown = (event) => {
    this.areaRef.current.setPointerCapture(event.pointerId);
    this.areaRef.current.addEventListener('pointermove', this.onPointerMove);

    this.moveStick(event);
  }

  onPointerUp = () => {
    this.areaRef.current.removeEventListener('pointermove', this.onPointerMove);

    this.resetStick();
  }

  onMove = (x, y) => {
    this.props.pushMessage({
      type: THUMB_STICK_POSITION_CHANGE_MSG,
      x,
      y,
    });

    this.props.onMove(x, y);
  }

  onObserverPointerDown = (event) => {
    const { areaX, areaY, areaRadius } = this.state;
    const { clientX, clientY } = event;

    if (MathOps.getDistanceBetweenTwoPoints(clientX, areaX, clientY, areaY) <= areaRadius) {
      return;
    }

    const left = clientX - areaRadius;
    const right = clientY - areaRadius;

    event.clientX = areaX;
    event.clientY = areaY;

    this.setState({
      areaPosition: {
        left: `${left}px`,
        top: `${right}px`,
      },
    }, this.updateArea);
  }

  render() {
    const { className } = this.props;
    const { areaPosition } = this.state;

    return (
      <div
        className={`thumb-stick ${className}`}
        ref={this.areaRef}
        onPointerDown={this.onPointerDown}
        onPointerUp={this.onPointerUp}
        style={areaPosition}
      >
        <canvas id='thumb-stick__control' ></canvas>
        <div
          className='thumb-stick__observer'
          onPointerDown={this.onObserverPointerDown}
        />
      </div>
    );
  }
}

ThumbStick.defaultProps = {
  className: '',
  onMove: () => {},
};

ThumbStick.propTypes = {
  className: PropTypes.string,
  onMove: PropTypes.func,
  pushMessage: PropTypes.func,
};

export const ConnectedThumbStick = withGame(ThumbStick);
