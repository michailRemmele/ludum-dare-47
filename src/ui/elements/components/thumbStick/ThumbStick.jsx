import React from 'react';
import PropTypes from 'prop-types';

import { Vector2 } from '@flyer-engine/core';

import './style.css';

class ThumbStick extends React.Component {
  constructor(props) {
    super(props);

    this.areaRef = React.createRef();

    this.state = {
      controlPosition: {},
    };
  }

  componentDidMount() {
    this.updateArea();

    window.addEventListener('resize', this.updateArea);

    this.areaRef.current.addEventListener('pointerdown', this.onPointerEvent);
    this.areaRef.current.addEventListener('pointermove', this.onPointerEvent);
    this.areaRef.current.addEventListener('pointerup', this.onPointerEvent);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateArea);

    this.areaRef.current.removeEventListener('pointerdown', this.onPointerEvent);
    this.areaRef.current.removeEventListener('pointermove', this.onPointerEvent);
    this.areaRef.current.removeEventListener('pointerup', this.onPointerEvent);
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

    this.setState({
      controlPosition: {
        transform: `translateX(${direction.x}px) translateY(${direction.y}px)`,
      },
    });

    direction.multiplyNumber(1 / direction.magnitude);

    this.props.onMove(direction.x, direction.y);
  }

  resetStick = () => {
    this.setState({
      controlPosition: {},
    });

    this.props.onMove(0, 0);
  }

  onPointerEvent = (event) => {
    if (event.type === 'pointerup') {
      this.resetStick();
    } else {
      this.moveStick(event);
    }
  }

  render() {
    const { className } = this.props;
    const { controlPosition } = this.state;

    return (
      <div
        className={`thumb-stick ${className}`}
        ref={this.areaRef}
      >
        <div
          className='thumb-stick__control'
          style={controlPosition}
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
};

export default ThumbStick;
