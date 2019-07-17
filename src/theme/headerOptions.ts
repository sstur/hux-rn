import { Platform } from 'react-native';
import { FONT_ALT_BOLD } from './constants';
import { NavigationStackScreenOptions } from 'react-navigation';

let shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  default: {},
});

export let defaultHeader: NavigationStackScreenOptions = {
  headerStyle: {
    height: 56,
    borderBottomWidth: 0,
    ...shadowStyle,
  },
  headerTitleContainerStyle: {
    paddingHorizontal: 10,
  },
  headerTintColor: '#000',
  headerTitleStyle: {
    fontFamily: FONT_ALT_BOLD,
    fontSize: 24,
    textAlign: 'left',
  },
};

export let noHeader: NavigationStackScreenOptions = {
  header: null,
  headerStyle: Platform.select({
    web: { boxShadow: 'none' },
    default: {},
  }) as any,
};
