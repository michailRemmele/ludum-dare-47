import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Switch, Route } from 'react-router';

import {
  GameProvider,
  SceneSwitcher,
} from './elements/common';
import { MainMenu } from './pages/mainMenu';
import { Game } from './pages/game';
import { Loader } from './pages/loader';

let root;

export function onInit(options) {
  const {
    sceneContext,
    messageBusObserver,
    storeObserver,
    pushMessage,
    pushAction,
    gameObjects,
  } = options;

  root = createRoot(document.getElementById('ui-root'));

  root.render(
    <GameProvider
      messageBusObserver={messageBusObserver}
      storeObserver={storeObserver}
      pushMessage={pushMessage}
      pushAction={pushAction}
      gameObjects={gameObjects}
    >
      <MemoryRouter>
        <SceneSwitcher sceneName={sceneContext.name}>
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
    </GameProvider>
  );
}

export function onDestroy() {
  if (root) {
    root.unmount();
    root = void 0;
  }
}
