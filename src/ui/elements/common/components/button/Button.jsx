import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

export class Button extends React.Component {
  render() {
    return (
      <button
        className={`button ${this.props.className}`}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
      >
        {this.props.title}
      </button>
    );
  }
}

Button.defaultProps = {
  className: '',
  title: '',
  onClick: () => {},
  disabled: false,
};

Button.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
