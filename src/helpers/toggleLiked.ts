import { AsyncStorage } from 'react-native';
import { Post } from '../types/types';
import fetchFromAPI from './fetchFromAPI';

async function toggleLiked(post: Post, updatePost: (post: Post) => void) {
  let { likedByViewer, likeCount } = post;
  updatePost({
    ...post,
    likedByViewer: !likedByViewer,
    likeCount: likedByViewer ? likeCount - 1 : likeCount + 1,
  });
  let authToken = await AsyncStorage.getItem('@authToken');
  await fetchFromAPI(`/posts/${post.id}/likes`, {
    method: 'POST',
    headers: { 'X-Auth': authToken || '' },
  });
}

export default toggleLiked;
