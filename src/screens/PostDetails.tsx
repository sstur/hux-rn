import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, AsyncStorage } from 'react-native';
import Text from '../components/Text';
import { usePosts } from '../context/Posts';
import toggleLiked from '../helpers/toggleLiked';
import { useNavigation } from '../helpers/navigation-hooks';
import PostView from '../components/PostView';
import CommentList from '../components/CommentList';
import { useCurrentUser } from '../context/CurrentUser';
import CommentForm from '../components/CommentForm';
import KeyboardSpacer from 'react-native-spacer';
import { useComments } from '../context/Comments';
import fetchFromAPI from '../helpers/fetchFromAPI';

export default function PostDetails() {
  let { getParam } = useNavigation();
  let { posts, updatePost } = usePosts();
  let id = String(getParam('id'));
  let { user } = useCurrentUser();
  let { addComment } = useComments(id);
  let [isSubmitting, setSubmitting] = useState(false);
  let addNewComment = useCallback(async (text: string) => {
    setSubmitting(true);
    let authToken = await AsyncStorage.getItem('@authToken');
    let result = await fetchFromAPI(`/posts/${post.id}/comments`, {
      headers: { 'X-Auth': authToken || '' },
      body: { text },
    });
    setSubmitting(false);
    if (result.isError) {
      // TODO
      return;
    }
    let comment = result.data.comment as Comment;
    addComment({
      ...comment,
      owner: user,
    });
  }, []);
  let maybePost = posts.find((post) => post.id === id);
  if (maybePost == null) {
    return (
      <View style={styles.flexCenter}>
        <Text>Post not found.</Text>
      </View>
    );
  }
  let post = maybePost;
  return (
    <KeyboardSpacer style={{ flex: 1 }}>
      <ScrollView>
        <PostView
          post={post}
          onLikePress={() => toggleLiked(post, updatePost)}
        />
        <CommentList post={post} updatePost={updatePost} />
      </ScrollView>
      <CommentForm
        user={user}
        onSubmit={addNewComment}
        isSubmitting={isSubmitting}
      />
    </KeyboardSpacer>
  );
}

let styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
