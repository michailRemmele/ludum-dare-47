import components from '../src/game/components';
import systems from '../src/game/systems';
import { scripts as scriptSystemScripts } from '../src/game/scripts';

import { componentsSchema, systemsSchema, scriptsSchema } from './schema';

import en from './locales/en.json';

const locales = {
  en,
};

const scripts = {
  scriptSystem: scriptSystemScripts,
};

export {
  components,
  systems,
  scripts,
  componentsSchema,
  systemsSchema,
  scriptsSchema,
  locales,
};
