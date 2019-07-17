import React, { useCallback } from 'react';
import { DrawerItemsProps } from 'react-navigation';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Avatar from '../components/Avatar';
import Text from './Text';
import { useCurrentUser } from '../context/CurrentUser';
import { useToken } from '../context/Token';
import { useNavigation } from '../helpers/navigation-hooks';

type Props = DrawerItemsProps;

export default function DrawerContent(props: Props) {
  let { user, clearCurrentUser } = useCurrentUser();
  let { clearToken } = useToken();
  let { navigate, closeDrawer } = useNavigation();

  let _onLogoutPress = useCallback(() => {
    clearCurrentUser();
    clearToken();
    navigate('login');
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Avatar
          source={{
            uri:
              user.photo ||
              'https://s.gravatar.com/avatar/135b97b3a34ac25525544cd1df930c84?s=256',
          }}
          size={64}
          style={styles.avatar}
        />
        <View>
          <Text fontStyle="alt" fontWeight="bold" style={styles.userName}>
            {user.name}
          </Text>
          <Text style={styles.userEmail} fontStyle="alt">
            {user.email}
          </Text>
        </View>
      </View>
      <DrawerItem
        title="My Feed"
        icon="home"
        onPress={() => {
          closeDrawer();
        }}
      />
      <DrawerItem title="My Posts" icon="image" />
      <DrawerItem
        title="Edit Profile"
        icon="account-circle"
        onPress={() => {
          navigate('editProfile');
        }}
      />
      <View style={styles.footer}>
        <DrawerItem
          title="Log Out"
          icon="power-settings-new"
          onPress={_onLogoutPress}
        />
      </View>
    </View>
  );
}

function DrawerItem(props: {
  title: string;
  icon: string;
  onPress?: () => void;
}) {
  let { title, icon, onPress } = props;
  return (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <Icon name={icon} size={28} />
      <Text style={styles.drawerItemText}>{title}</Text>
    </TouchableOpacity>
  );
}

let styles = StyleSheet.create({
  root: {
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  userName: {
    fontSize: 20,
    color: '#2d2d2d',
  },
  userEmail: {
    fontSize: 16,
    color: '#2d2d2d',
  },
  drawerItem: {
    marginVertical: 16,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerItemText: {
    flex: 1,
    marginLeft: 10,
  },
  activeLabelStyle: {
    color: '#2d2d2d',
  },
  inactiveLabelStyle: {
    color: 'rgba(45,45,45,0.6)',
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  logOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logOutText: {
    fontSize: 14,
  },
});
