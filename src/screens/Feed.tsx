import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';

import Text from '../components/Text';
import PostView from '../components/PostView';
import FeedCard from '../components/FeedCard';
import toggleLiked from '../helpers/toggleLiked';
import { useNavigation } from '../helpers/navigation-hooks';
import { usePosts } from '../context/Posts';

export default function Feed() {
  let { navigate } = useNavigation();
  let { isLoading, posts, error, fetchPosts, updatePost } = usePosts();
  let [isRefreshing, setRefreshing] = useState(false);
  // Fetch posts the first time this is loaded.
  useEffect(() => {
    fetchPosts();
  }, []);
  let goToPost = (id: string) => {
    navigate('post', { id });
  };
  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.flexCenter}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.flexCenter}>
        <Text>{error}</Text>
        <View style={{ height: 20 }} />
        <Button mode="contained" onPress={fetchPosts}>
          Try again
        </Button>
      </View>
    );
  }
  return (
    <View style={styles.flexCenter}>
      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        refreshing={isRefreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await fetchPosts();
          setRefreshing(false);
        }}
        renderItem={({ item }) => (
          <FeedCard>
            <PostView
              post={item}
              onAuthorPress={() => goToPost(item.id)}
              onImagePress={() => goToPost(item.id)}
              onLikePress={() => toggleLiked(item, updatePost)}
              onCommentPress={() => goToPost(item.id)}
            />
          </FeedCard>
        )}
      />
    </View>
  );
}

let styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
