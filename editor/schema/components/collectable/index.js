export const collectable = {
  title: 'components.collectable.title',
  fields: [
    {
      name: 'name',
      title: 'components.collectable.name.title',
      type: 'select',
      referenceId: 'names',
    },
  ],
  // TODO: Custom view. Get items list dynamically
  references: {
    names: {
      items: [
        {
          title: 'components.collectable.names.healGrass.title',
          value: 'healGrass',
        },
        {
          title: 'components.collectable.names.ogreGrass.title',
          value: 'ogreGrass',
        },
        {
          title: 'components.collectable.names.boomGrass.title',
          value: 'boomGrass',
        },
      ],
    },
  },
  getInitial: () => ({
    name: '',
  }),
};
