import React from 'react';

import './style.css';

export class Loader extends React.Component {
  render() {
    return (
      <div className='loader'>
        <h1 className='loader__title'>
          Loading Game...
        </h1>
      </div>
    );
  }
}
