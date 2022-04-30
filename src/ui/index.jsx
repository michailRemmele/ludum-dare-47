import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Switch, Route } from 'react-router';

import {
  GameProvider,
  SceneSwitcher,
} from './elements/common';
import { MainMenu } from './pages/mainMenu';
import { Game } from './pages/game';
import { Loader } from './pages/loader';

export function onInit(options) {
  const {
    sceneName,
    messageBusObserver,
    storeObserver,
    pushMessage,
    pushAction,
    entities,
  } = options;

  ReactDOM.render(
    <GameProvider
      messageBusObserver={messageBusObserver}
      storeObserver={storeObserver}
      pushMessage={pushMessage}
      pushAction={pushAction}
      entities={entities}
    >
      <MemoryRouter>
        <SceneSwitcher sceneName={sceneName}>
          <Switch>
            <Route path='/mainMenu'>
              <MainMenu/>
            </Route>
            <Route path='/game'>
              <Game/>
            </Route>
            <Route path='/loader'>
              <Loader/>
            </Route>
          </Switch>
        </SceneSwitcher>
      </MemoryRouter>
    </GameProvider>,
    document.getElementById('ui-root')
  );
}

export function onDestroy() {
  ReactDOM.unmountComponentAtNode(
    document.getElementById('ui-root')
  );
}
