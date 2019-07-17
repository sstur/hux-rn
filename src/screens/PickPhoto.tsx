import React, { useState, Fragment } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { useNavigation } from '../helpers/navigation-hooks';

export type ImageParam = {
  uri: string;
  width: number;
  height: number;
  type: 'image' | 'video' | undefined;
};

export default function PickPhoto() {
  let { navigate } = useNavigation();
  let [snackbarText, setSnackbarText] = useState('');

  const launchCamera = async () => {
    try {
      let isPermitted = await askPermissions();
      if (!isPermitted) {
        setSnackbarText('Camera permission not granted.');
        return;
      }
      let result = await ImagePicker.launchCameraAsync();
      navigateToNewPost(result);
    } catch (error) {
      setSnackbarText(error.message);
    }
  };

  let launchGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync();
      navigateToNewPost(result);
    } catch (error) {
      setSnackbarText(error.message);
    }
  };

  const askPermissions = async () => {
    let { status: permCamera } = await Permissions.askAsync(Permissions.CAMERA);
    let { status: permCameraRoll } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
    );
    return permCamera === 'granted' && permCameraRoll === 'granted'
      ? true
      : false;
  };

  let navigateToNewPost = (result: ImagePicker.ImagePickerResult) => {
    if (!result.cancelled) {
      let image: ImageParam = {
        uri: result.uri,
        width: result.width,
        height: result.height,
        type: result.type,
      };
      navigate('newPost', { image });
    }
  };

  return (
    <Fragment>
      <View style={styles.container}>
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={launchCamera}
        >
          Take a Photo
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={launchGallery}
        >
          Choose from Gallery
        </Button>
      </View>
      <Snackbar
        visible={snackbarText != ''}
        onDismiss={() => setSnackbarText('')}
        duration={Snackbar.DURATION_SHORT}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: 12,
  },
  buttonContent: {
    height: 48,
  },
});
