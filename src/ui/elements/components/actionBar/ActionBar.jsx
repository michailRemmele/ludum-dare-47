import React from 'react';
import PropTypes from 'prop-types';

import ActionView from '../../atoms/actionView/ActionView';

import './style.css';

const ACTION_KEY = 'E';

class ActionBar extends React.PureComponent {
  render() {
    return (
      <ActionView
        className={`action-bar ${this.props.className}`}
        onClick={this.props.onClick}
        stopPropagate={true}
      >
        <span className='action-bar__key'>
          {ACTION_KEY}
        </span>
        Collect
      </ActionView>
    );
  }
}

ActionBar.defaultProps = {
  className: '',
  onClick: () => {},
};

ActionBar.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default ActionBar;
