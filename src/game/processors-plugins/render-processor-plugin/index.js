import { IOC, RESOURCES_LOADER_KEY_NAME } from '@flyer-engine/core';

import RenderProcessor from 'game/processors/renderProcessor/renderProcessor';

const RENDERABLE_COMPONENT_NAME = 'renderable';
const TRANSFORM_COMPONENT_NAME = 'transform';

export class RenderProcessorPlugin {
  async load(options) {
    const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME);

    const {
      windowNodeId,
      textureAtlas,
      textureAtlasDescriptor,
      backgroundColor,
      sortingLayers,
      scaleSensitivity,
      createGameObjectObserver,
      store,
      messageBus,
    } = options;

    const window = document.getElementById(windowNodeId);
    const resources = [ textureAtlas, textureAtlasDescriptor ];
    const loadedResources = await Promise.all(resources.map((resource) => {
      return resourceLoader.load(resource);
    }));

    return new RenderProcessor({
      window,
      textureAtlas: loadedResources[0],
      textureAtlasDescriptor: loadedResources[1],
      backgroundColor,
      sortingLayers,
      scaleSensitivity,
      gameObjectObserver: createGameObjectObserver({
        components: [
          RENDERABLE_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
      store,
      messageBus,
    });
  }
}
