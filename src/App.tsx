import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import createAppContainer from './helpers/createAppContainer';
import FontLoader from './components/FontLoader';
import ThemeProvider from './theme/ThemeProvider';
import { PostsProvider } from './context/Posts';
import { CommentsProvider } from './context/Comments';
import { TokenProvider } from './context/Token';
import { CurrentUserProvider } from './context/CurrentUser';
import { defaultHeader } from './theme/headerOptions';

import FeedScreen from './screens/FeedWithDrawer';
import PostDetailsScreen from './screens/PostDetails';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';
import NewPostScreen from './screens/NewPost';
import PickPhotoScreen from './screens/PickPhoto';
import EditProfileScreen from './screens/EditProfile';

const AppNavigator = createStackNavigator(
  {
    login: {
      screen: LoginScreen,
      navigationOptions: {
        title: 'Login',
      },
    },
    signup: {
      screen: SignupScreen,
      navigationOptions: {
        title: 'Sign up',
      },
    },
    feed: {
      screen: FeedScreen,
      navigationOptions: {
        title: 'Feed',
      },
    },
    post: {
      screen: PostDetailsScreen,
      path: 'posts/:id',
      navigationOptions: {
        title: 'Post',
      },
    },
    newPost: {
      screen: NewPostScreen,
      navigationOptions: {
        title: 'New Post',
      },
    },
    photo: {
      screen: PickPhotoScreen,
      navigationOptions: {
        title: 'Choose a Photo',
      },
    },
    editProfile: {
      screen: EditProfileScreen,
      navigationOptions: {
        title: 'Edit Profile',
      },
      path: 'profile',
    },
  },
  {
    initialRouteName: 'login',
    headerMode: 'screen',
    headerLayoutPreset: 'left',
    defaultNavigationOptions: {
      ...defaultHeader,
    },
    // This is to workaround a layout issue on web:
    cardStyle: { ...StyleSheet.absoluteFillObject },
  },
);

let AppContainer = createAppContainer(AppNavigator);

export default function App() {
  return (
    <FontLoader>
      <ThemeProvider>
        <TokenProvider>
          <CurrentUserProvider>
            <PostsProvider>
              <CommentsProvider>
                <AppContainer />
              </CommentsProvider>
            </PostsProvider>
          </CurrentUserProvider>
        </TokenProvider>
      </ThemeProvider>
    </FontLoader>
  );
}
