import React from 'react';
import PropTypes from 'prop-types';

import ActionView from '../../atoms/actionView/ActionView';

import './style.css';

class ActionBar extends React.Component {
  render() {
    return (
      <ActionView
        className={`action-bar ${this.props.className}`}
        onClick={this.props.onClick}
        stopPropagate={true}
      >
        <span
          className='action-bar__key'
        >
          {this.props.keyName}
        </span>
        {this.props.title}
      </ActionView>
    );
  }
}

ActionBar.defaultProps = {
  className: '',
  onClick: () => {},
  keyName: '',
  title: '',
};

ActionBar.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  keyName: PropTypes.string,
  title: PropTypes.string,
};

export default ActionBar;
