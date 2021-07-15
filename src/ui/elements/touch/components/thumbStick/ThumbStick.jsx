import React from 'react';
import PropTypes from 'prop-types';
import { Vector2 } from '@flyer-engine/core';

import { withGame } from '../../../common';

import './style.css';

const THUMB_STICK_POSITION_CHANGE_MSG = 'THUMB_STICK_POSITION_CHANGE';

export class ThumbStick extends React.Component {
  constructor(props) {
    super(props);

    this.areaRef = React.createRef();
    this.controlRef = React.createRef();
    this.observerRef = React.createRef();

    this.state = {
      areaPosition: {},
    };

    this.pointerId = null;
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
    });
  }

  moveStick = (event) => {
    const { areaRadius, areaX, areaY } = this.state;

    const direction = new Vector2(event.clientX - areaX, event.clientY - areaY);
    const magnitude = direction.magnitude;

    if (magnitude > areaRadius) {
      direction.multiplyNumber(areaRadius / magnitude);
    }

    this.controlRef.current.style.transform =
      `translateX(${Math.floor(direction.x)}px) translateY(${Math.floor(direction.y)}px)`;

    direction.multiplyNumber(1 / areaRadius);

    this.onMove(direction.x, direction.y);
  }

  resetStick = () => {
    this.setState({
      areaPosition: {},
    }, this.updateArea);

    this.controlRef.current.style.transform = '';

    this.onMove(0, 0);
  }

  onPointerMove = (event) => {
    this.moveStick(event);
  }

  onPointerDown = (event) => {
    if (this.pointerId) {
      return;
    }

    this.observerRef.current.style.width = '100%';
    this.pointerId = event.pointerId;

    this.areaRef.current.setPointerCapture(event.pointerId);
    this.areaRef.current.addEventListener('pointermove', this.onPointerMove);

    this.moveStick(event);
  }

  onPointerUp = (event) => {
    if (this.pointerId !== event.pointerId) {
      return;
    }

    this.observerRef.current.style = '';
    this.pointerId = null;

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

    if (this.pointerId) {
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
        onPointerLeave={this.onPointerUp}
        onPointerCancel={this.onPointerUp}
        style={areaPosition}
      >
        <div
          ref={this.controlRef}
          className='thumb-stick__control'
        />
        <div
          ref={this.observerRef}
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
