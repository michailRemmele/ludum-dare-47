import components from '../src/game/components';
import systems from '../src/game/systems';

import { componentsSchema, systemsSchema } from './schema';

import en from './locales/en.json';

const locales = {
  en,
};

export {
  components,
  systems,
  componentsSchema,
  systemsSchema,
  locales,
};
