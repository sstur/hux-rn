type ObjectOf<T> = { [key: string]: T };

// Fonts
declare module '*.ttf';
declare module '*.png';

// Modules which don't provide types by default
declare module '@react-navigation/web' {
  let createBrowserApp: any;
  export { createBrowserApp };
}

declare module 'react-native-spacer' {
  let Spacer: any;
  export default Spacer;
}
