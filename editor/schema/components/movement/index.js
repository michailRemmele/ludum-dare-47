export const movement = {
  title: 'components.movement.title',
  fields: [
    {
      name: 'speed',
      title: 'components.movement.speed.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    speed: 0,
  }),
};
