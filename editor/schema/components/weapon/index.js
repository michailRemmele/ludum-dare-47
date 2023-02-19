import { WeaponWidget } from './view';

export const weapon = {
  title: 'components.weapon.title',
  fields: [
    {
      name: 'type',
      title: 'components.weapon.type.title',
      type: 'select',
      referenceId: 'types',
    },
    {
      name: 'cooldown',
      title: 'components.weapon.cooldown.title',
      type: 'number',
    },
    {
      name: 'properties.damage',
      title: 'components.weapon.properties.damage.title',
      type: 'number',
    },
    {
      name: 'properties.range',
      title: 'components.weapon.properties.range.title',
      type: 'number',
    },
    {
      name: 'properties.projectileSpeed',
      title: 'components.weapon.properties.projectileSpeed.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'range',
      },
    },
    {
      name: 'properties.projectileRadius',
      title: 'components.weapon.properties.projectileRadius.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'range',
      },
    },
    {
      name: 'properties.projectileModel',
      title: 'components.weapon.properties.projectileModel.title',
      type: 'select',
      referenceId: 'models',
      dependency: {
        name: 'type',
        value: 'range',
      },
    },
  ],
  references: {
    types: {
      items: [
        {
          title: 'components.weapon.types.melee.title',
          value: 'melee',
        },
        {
          title: 'components.weapon.types.range.title',
          value: 'range',
        },
      ],
    },
  },
  view: WeaponWidget,
  getInitialState: () => ({
    type: 'melee',
    cooldown: 1000,
    properties: {
      damage: 1,
      range: 10,
    },
  }),
};
