import React from 'react';
import PropTypes from 'prop-types';

import {
  withGame,
  Button,
} from '../../elements/common';

import {
  GithubIcon,
  TelegramIcon,
} from '../../media/icons';

import './style.css';

const LOAD_SCENE_MSG = 'LOAD_SCENE';
const GAME_SCENE_NAME = 'game';

export class MainMenu extends React.Component {
  onPlay() {
    this.props.pushMessage({
      type: LOAD_SCENE_MSG,
      name: GAME_SCENE_NAME,
    });
  }

  render() {
    return (
      <div className='main-menu'>
        <header className='main-menu__header'>
          <ul className='main-menu__socials'>
            <li className='socials__item'>
              <a
                className='socials__link socials__link_github'
                href='https://github.com/michailRemmele/ludum-dare-47'
                target='_blank'
                rel='noopener noreferrer'
              >
                <GithubIcon className='socials__icon'/>
              </a>
            </li>
            <li className='socials__item'>
              <a
                className='socials__link socials__link_telegram'
                href='https://t.me/misha_pishet_dvizhok'
                target='_blank'
                rel='noopener noreferrer'
              >
                <TelegramIcon className='socials__icon'/>
              </a>
            </li>
          </ul>
        </header>
        <main className='main-menu__main'>
          <header className='main__header'>
            <h1 className='main-menu__title'>
              Infinite Battle
            </h1>
          </header>
          <nav className='main-menu__menu menu'>
            <ul className='menu__list'>
              <li className='menu__item'>
                <Button
                  className='menu__button'
                  title='Play'
                  onClick={() => this.onPlay()}
                />
              </li>
            </ul>
          </nav>
        </main>
      </div>
    );
  }
}

MainMenu.propTypes = {
  pushMessage: PropTypes.func,
};

export const WrappedMainMenu = withGame(MainMenu);
