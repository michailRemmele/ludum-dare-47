export const player = {
  fields: [
    {
      name: 'skyId',
      title: 'resources.scriptSystem.player.skyId.title',
      type: 'string',
    },
    {
      name: 'threshold',
      title: 'resources.scriptSystem.player.threshold.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    skyId: '',
    threshold: 0,
  }),
};
