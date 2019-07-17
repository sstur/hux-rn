import React, { Fragment, useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Avatar,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';

import { useCurrentUser } from '../context/CurrentUser';

export default function EditProfile() {
  let { user } = useCurrentUser();
  let [name, setName] = useState('');
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [snackbarText, setSnackbarText] = useState('');
  let emailInput = useRef<TextInput>();
  let passwordInput = useRef<TextInput>();

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const onSubmit = () => {
    if (!name || !email) {
      setSnackbarText('Empty name or email or password.');
      return;
    }
    setSnackbarText('Not implemented.');
  };

  if (!user.photo) {
    return <ActivityIndicator />;
  }

  return (
    <Fragment>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <View style={styles.avatarWrapper}>
            <Avatar.Image size={96} source={{ uri: user.photo }} />
          </View>
          <Text style={styles.link} onPress={() => {}}>
            Set Profile Picture
          </Text>
          <TextInput
            mode="outlined"
            label="Display Name"
            returnKeyType="next"
            value={name}
            style={styles.textInput}
            onChangeText={(name) => setName(name)}
            onSubmitEditing={() => {
              if (emailInput.current) {
                emailInput.current.focus();
              }
            }}
          />
          <TextInput
            ref={emailInput as any}
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            label="Email Address"
            returnKeyType="next"
            value={email}
            style={styles.textInput}
            onChangeText={(email) => setEmail(email)}
            onSubmitEditing={() => {
              if (passwordInput.current) {
                passwordInput.current.focus();
              }
            }}
          />
          <TextInput
            secureTextEntry
            ref={passwordInput as any}
            mode="outlined"
            label="Password"
            returnKeyType="go"
            value={password}
            style={styles.textInput}
            onChangeText={(password) => setPassword(password)}
            onSubmitEditing={onSubmit}
          />
        </View>
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={onSubmit}
        >
          Save
        </Button>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginVertical: 24,
  },
  link: {
    color: '#f7444e',
    textAlign: 'center',
    marginBottom: 30,
  },
  textInput: {
    marginBottom: 22,
    borderColor: '#e8e8e8',
  },
  button: {
    marginBottom: 30,
  },
  buttonContent: {
    height: 48,
  },
});
