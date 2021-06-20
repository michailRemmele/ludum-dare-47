import React from 'react';
import PropTypes from 'prop-types';
import { Vector2, MathOps } from '@flyer-engine/core';

import { withGame } from '../../../common';

import './style.css';

const THUMB_STICK_POSITION_CHANGE_MSG = 'THUMB_STICK_POSITION_CHANGE';
const ANIMATION_STEP_FACTOR = 0.1;

export class ThumbStick extends React.Component {
  constructor(props) {
    super(props);

    this.areaRef = React.createRef();

    this.state = {
      controlPosition: {},
      areaPosition: {},
      directionX: 0,
      directionY: 0,
    };
  }

  componentDidMount() {
    this.updateArea();

    window.addEventListener('resize', this.updateArea);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateArea);
  }

  updateArea = () => {
    const { left, right, top, bottom, width } = this.areaRef.current.getBoundingClientRect();

    this.setState({
      areaRadius: width / 2,
      areaX: (left + right) / 2,
      areaY: (top + bottom) / 2,
      animationStep: width * ANIMATION_STEP_FACTOR,
    });
  }

  moveStick = (event) => {
    const { areaRadius, areaX, areaY, animationStep } = this.state;

    const direction = new Vector2(event.clientX - areaX, event.clientY - areaY);
    const magnitude = direction.magnitude;

    if (magnitude > areaRadius) {
      direction.multiplyNumber(areaRadius / magnitude);
    }

    const deltaX = Math.abs(this.state.directionX - direction.x);
    const deltaY = Math.abs(this.state.directionY - direction.y);
    if (deltaX > animationStep || deltaY > animationStep) {
      this.setState({
        controlPosition: {
          transform: `translateX(${direction.x}px) translateY(${direction.y}px)`,
        },
        directionX: direction.x,
        directionY: direction.y,
      });
    }

    direction.multiplyNumber(1 / direction.magnitude);

    this.onMove(direction.x, direction.y);
  }

  resetStick = () => {
    this.setState({
      controlPosition: {},
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
    const { controlPosition, areaPosition } = this.state;

    return (
      <div
        className={`thumb-stick ${className}`}
        ref={this.areaRef}
        onPointerDown={this.onPointerDown}
        onPointerUp={this.onPointerUp}
        style={areaPosition}
      >
        <div
          className='thumb-stick__control'
          style={controlPosition}
        />
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
