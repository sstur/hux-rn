import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
  KeyboardAvoidingView,
} from 'react-native';
import { TextInput, Button, Snackbar, IconButton } from 'react-native-paper';
import FixedRatioImage from '../components/FixedRatioImage';
import fetchFromAPI from '../helpers/fetchFromAPI';
import { useNavigation } from '../helpers/navigation-hooks';
import { useToken } from '../context/Token';
import { useCurrentUser } from '../context/CurrentUser';

import { User } from '../types/types';

import loginImage from '../../assets/login_image.png';

async function checkAuth(): Promise<
  | { isLoggedIn: false }
  | { isLoggedIn: true; authToken: string; currentUser: User }
> {
  let authToken = await AsyncStorage.getItem('@authToken');
  if (authToken == null) {
    return { isLoggedIn: false };
  }
  let result = await fetchFromAPI('/users/me', {
    headers: { 'X-Auth': authToken },
  });
  if (result.isError) {
    return { isLoggedIn: false };
  }
  let user = result.data.user as User;
  return { isLoggedIn: true, authToken, currentUser: user };
}

function Login() {
  let { isLoading, error, authToken, login, saveToken } = useToken();
  let { saveCurrentUser } = useCurrentUser();
  let { replace } = useNavigation();
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [snackbarText, setSnackbarText] = useState('');
  let passwordInput = useRef<TextInput>();

  // Check the saved auth token before we display the form.
  let [isInitializing, setInitializing] = useState(true);
  useEffect(() => {
    async function init() {
      let result = await checkAuth();
      if (result.isLoggedIn) {
        saveToken(result.authToken);
        saveCurrentUser(result.currentUser);
        replace('feed');
      } else {
        setInitializing(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    error && setSnackbarText(error);
  }, [error]);

  useEffect(() => {
    authToken && replace('feed');
  }, [authToken]);

  const onSubmit = () => {
    if (!email || !password) {
      setSnackbarText('Empty email or password.');
      return;
    }
    login(email, password);
  };

  if (isInitializing) {
    return (
      <View style={styles.flexCenter}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Fragment>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="position" enabled>
          <View>
            <View style={styles.imageWrapper}>
              <FixedRatioImage
                source={loginImage}
                aspectRatio={1.224}
                resizeMode="contain"
              />
            </View>
            <TextInput
              disabled={isLoading}
              autoCapitalize="none"
              keyboardType="email-address"
              mode="outlined"
              label="Email"
              value={email}
              style={styles.textInput}
              returnKeyType="next"
              onSubmitEditing={() => {
                if (passwordInput.current) {
                  passwordInput.current.focus();
                }
              }}
              onChangeText={(email) => setEmail(email)}
            />
            <TextInput
              secureTextEntry
              ref={passwordInput as any}
              returnKeyType="go"
              disabled={isLoading}
              onSubmitEditing={onSubmit}
              mode="outlined"
              label="Password"
              value={password}
              style={styles.textInput}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
          <Button
            disabled={isLoading}
            loading={isLoading}
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContent}
            onPress={onSubmit}
          >
            Log In
          </Button>
        </KeyboardAvoidingView>
      </ScrollView>
      <Snackbar
        visible={snackbarText != ''}
        onDismiss={() => setSnackbarText('')}
        duration={1000}
        action={{
          label: 'Close',
          onPress: () => setSnackbarText(''),
        }}
      >
        {snackbarText}
      </Snackbar>
    </Fragment>
  );
}

Login.navigationOptions = ({ navigation }: any) => {
  return {
    headerRight: (
      <IconButton
        icon="person-add"
        color="black"
        size={24}
        onPress={() => {
          navigation.push('signup');
        }}
      />
    ),
  };
};

let styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  imageWrapper: {
    marginVertical: 28,
    marginHorizontal: 38,
  },
  textInput: {
    marginBottom: 30,
    borderColor: '#e8e8e8',
  },
  button: {
    marginBottom: 30,
  },
  buttonContent: {
    height: 48,
  },
});

export default Login;
