import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import Text from '../components/Text';
import PostButton from '../components/PostButton';
import FixedRatioImage from '../components/FixedRatioImage';
import Avatar from '../components/Avatar';
import formatDuration from '../helpers/formatDuration';
import { Post } from '../types/types';

type Props = {
  post: Post;
  onAuthorPress?: () => void;
  onImagePress?: () => void;
  onLikePress?: () => void;
  onCommentPress?: () => void;
};

let noop = () => {};

export default function PostView(props: Props) {
  let {
    post,
    onAuthorPress,
    onImagePress,
    onLikePress,
    onCommentPress,
  } = props;
  let { owner } = post;
  // Request a smaller size image.
  let imageURL = post.photo.replace(
    /\/image\/upload\/v\d+\//,
    '/image/upload/w_1600/',
  );
  return (
    <View style={styles.post}>
      <TouchableWithoutFeedback onPress={onAuthorPress}>
        <View style={styles.authorInfo}>
          <Avatar
            size={40}
            style={styles.avatar}
            source={{ uri: owner.photo }}
          />
          <Text fontStyle="alt" fontWeight="bold" style={styles.authorName}>
            {owner.name}
          </Text>
          <Text style={styles.postedAt}>
            {formatDuration(post.createdAt, Date.now())}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={onImagePress}>
        <FixedRatioImage aspectRatio={1} source={{ uri: imageURL }} />
      </TouchableWithoutFeedback>
      <View style={styles.buttonRow}>
        <PostButton
          icon={post.likedByViewer ? 'favorite' : 'favorite-border'}
          iconColor={post.likedByViewer ? '#f7444e' : 'black'}
          text={post.likeCount === 1 ? '1 Like' : `${post.likeCount} Likes`}
          onPress={onLikePress || noop}
        />
        <PostButton
          icon="speaker-notes"
          iconColor="black"
          text={
            post.commentCount === 1
              ? '1 Comment'
              : `${post.commentCount} Comments`
          }
          onPress={onCommentPress || noop}
        />
      </View>
      <Text style={styles.caption}>{post.text}</Text>
    </View>
  );
}

let styles = StyleSheet.create({
  post: {},
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    margin: 12,
  },
  authorName: {
    flex: 1,
    fontSize: 18,
  },
  postedAt: {
    color: '#999',
    fontSize: 16,
    paddingHorizontal: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  caption: {
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
});
