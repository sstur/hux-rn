import React, { useState, useRef, Fragment } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import fetchFromAPI from '../helpers/fetchFromAPI';
import { useNavigation } from '../helpers/navigation-hooks';

type SignupResult = {
  success: boolean;
};

function Signup() {
  let { navigate } = useNavigation();
  let [name, setName] = useState('');
  let [email, setEmail] = useState('');
  let [snackbarText, setSnackbarText] = useState('');
  let emailInput = useRef<TextInput>();

  const onSubmit = async () => {
    if (!name || !email) {
      setSnackbarText('Empty name or email.');
      return;
    }
    let result = await fetchFromAPI('/users', {
      method: 'POST',
      body: { name, email },
    });
    if (result.isError) {
      setSnackbarText(result.errorMessage);
      return;
    }
    let data = result.data as SignupResult;
    if (data.success) {
      navigate('login');
    } else {
      setSnackbarText('Unable to create user.');
    }
  };

  return (
    <Fragment>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ paddingTop: 30 }}>
          <TextInput
            mode="outlined"
            label="Name"
            value={name}
            style={styles.textInput}
            returnKeyType="next"
            onChangeText={(value) => setName(value)}
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
            label="Email"
            value={email}
            style={styles.textInput}
            returnKeyType="go"
            onChangeText={(value) => setEmail(value)}
            onSubmitEditing={onSubmit}
          />
        </View>
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={onSubmit}
        >
          Sign up
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

let styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
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

export default Signup;
