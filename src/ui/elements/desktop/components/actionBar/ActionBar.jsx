import React from 'react';
import PropTypes from 'prop-types';

import { ActionView } from '../../../common';

import './style.css';

const SIZE = {
  MD: 'md',
  SM: 'sm',
};

export const ActionBar = ({
  className,
  onClick,
  iconSrc,
  iconDescr,
  keyName,
  title,
  size,
}) => (
  <ActionView
    className={`action-bar action-bar_${size} ${className}`}
    onClick={onClick}
    stopPropagate={true}
  >
    <span className='action-bar__key'>
      {keyName}
    </span>
    {iconSrc && (
      <img
        className='action-bar__icon'
        src={iconSrc}
        alt={iconDescr}
      />
    )}
    {title}
  </ActionView>
);

ActionBar.defaultProps = {
  className: '',
  onClick: () => {},
  keyName: '',
  title: '',
  iconSrc: void '',
  iconDescr: '',
  size: SIZE.MD,
};

ActionBar.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  keyName: PropTypes.string,
  title: PropTypes.string,
  iconSrc: PropTypes.string,
  iconDescr: PropTypes.string,
  size: PropTypes.oneOf([ SIZE.MD, SIZE.SM ]),
};

export const ActionBarMemoized = React.memo(ActionBar);
