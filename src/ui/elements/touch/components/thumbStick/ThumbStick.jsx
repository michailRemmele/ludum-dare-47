import React from 'react';
import PropTypes from 'prop-types';
import { Vector2 } from 'remiz';

import { EventType } from '../../../../../events';
import { withGame } from '../../../common';

import './style.css';

export class ThumbStick extends React.Component {
  constructor(props) {
    super(props);

    this.areaRef = React.createRef();
    this.controlRef = React.createRef();
    this.observerRef = React.createRef();

    this.state = {};

    this.pointerId = null;
  }

  componentDidMount() {
    this.updateArea();

    window.addEventListener('resize', this.updateArea);
  }

  componentWillUnmount() {
    console.log('UNMOUNT');

    window.removeEventListener('resize', this.updateArea);

    this.observerRef.current.removeEventListener('pointermove', this.onPointerMove);
    this.onMove(0, 0);

    console.log('UNMOUNT END');
  }

  updateArea = () => {
    const { left, right, top, bottom, width } = this.areaRef.current.getBoundingClientRect();
    const { left: observerX, top: observerY } = this.observerRef.current.getBoundingClientRect();

    this.setState({
      areaRadius: width / 2,
      areaX: (left + right) / 2,
      areaY: (top + bottom) / 2,
      observerX,
      observerY,
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
    this.areaRef.current.style = '';
    this.controlRef.current.style = '';

    this.updateArea();

    this.onMove(0, 0);
  }

  onPointerMove = (event) => {
    if (this.pointerId !== event.pointerId) {
      return;
    }

    this.moveStick(event);
  }

  onPointerDown = (event) => {
    const { areaX, areaY, areaRadius, observerX, observerY } = this.state;
    const { clientX, clientY } = event;

    if (this.pointerId) {
      return;
    }

    this.pointerId = event.pointerId;

    const left = clientX - observerX - areaRadius;
    const top = clientY - observerY - areaRadius;

    event.clientX = areaX;
    event.clientY = areaY;

    this.areaRef.current.style.left = `${left}px`;
    this.areaRef.current.style.top = `${top}px`;

    this.updateArea();

    this.observerRef.current.setPointerCapture(event.pointerId);
    this.observerRef.current.addEventListener('pointermove', this.onPointerMove);

    this.moveStick(event);
  }

  onPointerUp = (event) => {
    if (this.pointerId !== event.pointerId) {
      return;
    }

    this.pointerId = null;

    this.observerRef.current.removeEventListener('pointermove', this.onPointerMove);

    this.resetStick();
  }

  onMove = (x, y) => {
    this.props.scene.emit(EventType.ThumbStickInput, { x, y });

    this.props.onMove(x, y);
  }

  render() {
    const { className } = this.props;

    return (
      <div
        ref={this.observerRef}
        className={`thumb-stick-observer ${className}`}
        onPointerDown={this.onPointerDown}
        onPointerUp={this.onPointerUp}
        onPointerLeave={this.onPointerUp}
        onPointerCancel={this.onPointerUp}
      >
        <div
          ref={this.areaRef}
          className='thumb-stick'
        >
          <div
            ref={this.controlRef}
            className='thumb-stick__control'
          />
        </div>
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
  scene: PropTypes.any,
};

export const ConnectedThumbStick = withGame(ThumbStick);
