import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

export class ActionView extends React.Component {
  stopPropagate = (event) => {
    if (!this.props.stopPropagate) {
      return;
    }

    event.stopPropagation();
  }

  onDoubleClick = (event) => {
    if (!this.props.onDoubleClick) {
      this.stopPropagate(event);
    } else {
      this.props.onDoubleClick(event);
    }
  }

  onContextMenu = (event) => {
    if (!this.props.onContextMenu) {
      event.preventDefault();
      this.stopPropagate(event);
    } else {
      this.props.onContextMenu(event);
    }
  }

  onMouseUp = (event) => {
    if (!this.props.onMouseUp) {
      this.stopPropagate(event);
    } else {
      this.props.onMouseUp(event);
    }
  }

  onMouseDown = (event) => {
    if (!this.props.onMouseDown) {
      this.stopPropagate(event);
    } else {
      this.props.onMouseDown(event);
    }
  }

  onClick = (event) => {
    if (!this.props.onClick) {
      this.stopPropagate(event);
    } else {
      this.props.onClick(event);
    }
  }

  onPointerUp = (event) => {
    if (!this.props.onPointerUp) {
      this.stopPropagate(event);
    } else {
      this.props.onPointerUp(event);
    }
  }

  render() {
    return (
      <button
        className={`action-view ${this.props.className}`}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onContextMenu={this.onContextMenu}
        onDoubleClick={this.onDoubleClick}
        onPointerUp={this.onPointerUp}
        onClick={this.onClick}
        disabled={this.props.disabled}
      >
        {this.props.children}
      </button>
    );
  }
}

ActionView.defaultProps = {
  className: '',
  disabled: false,
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
  disabled: PropTypes.bool,
  stopPropagate: PropTypes.bool,
};
