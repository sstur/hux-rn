import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, View, AsyncStorage } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';

import { usePosts } from '../context/Posts';
import { useCurrentUser } from '../context/CurrentUser';
import { useNavigation } from '../helpers/navigation-hooks';
import FixedRatioImage from '../components/FixedRatioImage';
import { ImageParam } from './PickPhoto';
import sendFile from '../helpers/sendFile';
import fetchFromAPI from '../helpers/fetchFromAPI';
import { Post } from '../types/types';
import KeyboardSpacer from 'react-native-spacer';

export default function NewPost() {
  let { navigate, getParam } = useNavigation();
  let { uri }: ImageParam = getParam('image');
  let { addPost } = usePosts();
  let { user } = useCurrentUser();
  let [caption, setCaption] = useState('');
  let [snackbarText, setSnackbarText] = useState('');
  let [isSubmitting, setSubmitting] = useState(false);
  // Go ahead and begin image upload.
  let uploadPromise = useMemo(() => {
    return sendFile(
      'POST',
      'https://api.cloudinary.com/v1_1/huxapp/image/upload',
      { upload_preset: 'jld8hkgs' },
      {
        file: {
          uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        },
      },
    );
  }, []);

  let onSubmit = async () => {
    setSubmitting(true);
    let result = await uploadPromise;
    if (result.isError) {
      let data = Object(result.data);
      // This will help us display the correct error from the server.
      let errorMessage =
        data.error && typeof data.error.message === 'string'
          ? data.error.message
          : result.errorMessage;
      setSnackbarText(errorMessage);
      setSubmitting(false);
      return;
    }
    let imageURL = result.data.secure_url;
    let authToken = await AsyncStorage.getItem('@authToken');
    result = await fetchFromAPI(`/posts`, {
      method: 'POST',
      headers: { 'X-Auth': authToken || '' },
      body: { text: caption, photo: imageURL },
    });
    setSubmitting(false);
    if (result.isError) {
      setSnackbarText(result.errorMessage);
      return;
    }
    let post = result.data.post as Post;
    addPost({
      ...post,
      owner: user,
      likedByViewer: false,
      likeCount: 0,
      commentCount: 0,
    });
    navigate('feed');
  };

  return (
    <KeyboardSpacer style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <FixedRatioImage
          aspectRatio={1}
          source={{ uri }}
          style={styles.previewImage}
        />
        <TextInput
          mode="outlined"
          label="Caption"
          value={caption}
          style={styles.captionInput}
          returnKeyType="go"
          onSubmitEditing={onSubmit}
          onChangeText={(caption) => setCaption(caption)}
        />
        <Button
          mode="contained"
          disabled={isSubmitting}
          loading={isSubmitting}
          contentStyle={styles.buttonContent}
          onPress={onSubmit}
        >
          UPLOAD POST
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
    </KeyboardSpacer>
  );
}

let styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 24,
  },
  previewImage: {
    borderRadius: 4,
  },
  captionInput: {
    marginVertical: 24,
  },
  buttonContent: {
    height: 48,
  },
});
