export const movement = {
  title: 'components.movement.title',
  fields: [
    {
      name: 'speed',
      title: 'components.movement.speed.title',
      type: 'number',
    },
  ],
  getInitial: () => ({
    speed: 0,
  }),
};
