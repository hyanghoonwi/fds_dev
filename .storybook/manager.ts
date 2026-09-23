import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import logo from './assets/fds-logo.png';

const theme = create({
  base: 'light',
  brandTitle: 'FDS',
  brandImage: logo,
});

addons.setConfig({
  theme,
});
