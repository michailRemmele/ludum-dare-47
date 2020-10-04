import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const ACTION_KEY = 'E';

class ActionBar extends React.PureComponent {
  render() {
    return (
      <div className={`action-bar ${this.props.className}`}>
        <span className='action-bar__key'>
          {ACTION_KEY}
        </span>
        Collect
      </div>
    );
  }
}

ActionBar.defaultProps = {
  className: '',
};

ActionBar.propTypes = {
  className: PropTypes.string,
  health: PropTypes.number,
};

export default ActionBar;
