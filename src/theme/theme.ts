import { DefaultTheme } from 'react-native-paper';

let theme = {
  ...DefaultTheme,
  dark: false,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    primary: '#f7444e',
    accent: '#f7444e',
  },
  fonts: {
    medium: 'Roboto Medium',
    regular: 'Roboto',
    light: 'Roboto Light',
    thin: 'Roboto Thin',
  },
};

export default theme;
