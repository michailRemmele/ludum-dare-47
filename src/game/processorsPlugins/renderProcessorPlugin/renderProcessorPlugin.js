import { ProcessorPlugin, IOC, RESOURCES_LOADER_KEY_NAME } from '@flyer-engine/core';

import RenderProcessor from '../../processors/renderProcessor/renderProcessor';

class RenderProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME);

    const {
      windowNodeId,
      textureAtlas,
      textureAtlasDescriptor,
      backgroundColor,
      sortingLayers,
      scaleSensitivity,
      gameObjectObserver,
      store,
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
      gameObjectObserver,
      store,
    });
  }
}

export default RenderProcessorPlugin;
