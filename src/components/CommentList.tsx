import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';

import Avatar from './Avatar';
import Text from './Text';
import formatDuration from '../helpers/formatDuration';
import { useComments } from '../context/Comments';
import { Post, Comment } from '../types/types';

type Props = {
  post: Post;
  updatePost: (post: Post) => void;
};

export default function CommentList(props: Props) {
  let { post } = props;
  let { isLoading, comments, error, fetchComments } = useComments(post.id);
  useEffect(() => {
    fetchComments();
  }, []);
  if (isLoading) {
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
        <Button mode="contained" onPress={fetchComments}>
          Try again
        </Button>
      </View>
    );
  }
  let commentHeader =
    comments.length === 0
      ? 'No comments to display.'
      : `Comments (${comments.length})`;
  return (
    <View>
      <Text fontStyle="alt" fontWeight="bold" style={styles.header}>
        {commentHeader}
      </Text>
      {comments.map((comment) => (
        <CommentView key={comment.id} comment={comment} />
      ))}
    </View>
  );
}

function CommentView(props: { comment: Comment }) {
  let { comment } = props;
  let { owner } = comment;
  return (
    <View style={styles.commentRow}>
      <Avatar size={40} style={styles.avatar} source={{ uri: owner.photo }} />
      <View style={styles.caption}>
        <Text fontStyle="alt">
          <Text fontWeight="bold">{owner.name + ' '}</Text>
          {comment.text}
        </Text>
      </View>
      <Text style={styles.postedAt}>
        {formatDuration(comment.createdAt, Date.now())}
      </Text>
    </View>
  );
}

let styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    fontSize: 18,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    margin: 12,
  },
  caption: {
    flex: 1,
  },
  postedAt: {
    color: '#999',
    fontSize: 16,
    paddingHorizontal: 12,
  },
});
