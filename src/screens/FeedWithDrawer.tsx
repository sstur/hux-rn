import React from 'react';
import { Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import {
  createDrawerNavigator,
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';

import FeedScreen from './Feed';
import DrawerContent from '../components/DrawerContent';

let { height, width } = Dimensions.get('window');
let drawerWidth = Math.min(width, height) - 64;

type NavArg = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

const FeedWithDrawer = createDrawerNavigator(
  {
    feedWithDrawer: {
      screen: FeedScreen,
      path: 'posts',
    },
  },
  {
    contentComponent: DrawerContent,
    drawerWidth,
  },
);

FeedWithDrawer.navigationOptions = ({ navigation }: NavArg) => ({
  headerLeft: (
    <IconButton icon="menu" onPress={() => navigation.toggleDrawer()} />
  ),
  headerRight: (
    <IconButton icon="add" onPress={() => navigation.navigate('photo')} />
  ),
});

export default FeedWithDrawer;
