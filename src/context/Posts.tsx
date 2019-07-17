import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';
import { AsyncStorage } from 'react-native';

import fetchFromAPI from '../helpers/fetchFromAPI';
import { Post, PostList } from '../types/types';

type State = {
  isLoading: boolean;
  posts: Array<Post>;
  error: string | null;
};

type Action =
  | {
      type: 'START_LOADING';
    }
  | {
      type: 'POSTS_RECEIVED';
      posts: Array<Post>;
    }
  | {
      type: 'ERROR_RECEIVED';
      error: string;
    }
  | {
      type: 'ADD_POST';
      post: Post;
    }
  | {
      type: 'UPDATE_POST';
      post: Post;
    };

type Dispatch = React.Dispatch<Action>;

let PostsStateContext = createContext<State | null>(null);
let PostsDispatchContext = createContext<Dispatch | null>(null);

function postsReducer(state: State, action: Action) {
  switch (action.type) {
    case 'START_LOADING': {
      return { ...state, isLoading: true, error: null };
    }
    case 'POSTS_RECEIVED': {
      return { ...state, isLoading: false, posts: action.posts };
    }
    case 'ERROR_RECEIVED': {
      return { ...state, isLoading: false, error: action.error };
    }
    case 'ADD_POST': {
      let { posts } = state;
      let newPost = action.post;
      let newPosts = [newPost, ...posts];
      return { ...state, posts: newPosts };
    }
    case 'UPDATE_POST': {
      let { posts } = state;
      let newPost = action.post;
      let newPosts = posts.map((post) => {
        return post.id === newPost.id ? newPost : post;
      });
      return { ...state, posts: newPosts };
    }
    default: {
      return state;
    }
  }
}

function PostsProvider({ children }: { children: React.ReactNode }) {
  let [state, dispatch] = useReducer(postsReducer, {
    isLoading: true,
    posts: [],
    error: null,
  });
  return (
    <PostsStateContext.Provider value={state}>
      <PostsDispatchContext.Provider value={dispatch}>
        {children}
      </PostsDispatchContext.Provider>
    </PostsStateContext.Provider>
  );
}

function usePostsState() {
  let context = useContext(PostsStateContext);
  if (context === null) {
    throw new Error('usePostsState must be used within a Provider');
  }
  return context;
}
function usePostsDispatch() {
  let context = useContext(PostsDispatchContext);
  if (context === null) {
    throw new Error('usePostsDispatch must be used within a Provider');
  }
  return context;
}

export function usePosts() {
  let { isLoading, posts, error } = usePostsState();
  // let { authToken } = useToken();
  let dispatch = usePostsDispatch();
  let fetchPosts = useCallback(async () => {
    dispatch({ type: 'START_LOADING' });
    let authToken = await AsyncStorage.getItem('@authToken');
    let result = await fetchFromAPI('/posts', {
      headers: { 'X-Auth': authToken || '' },
    });
    if (result.isError) {
      dispatch({ type: 'ERROR_RECEIVED', error: result.errorMessage });
    } else {
      let newPosts = result.data.posts as PostList;
      dispatch({ type: 'POSTS_RECEIVED', posts: newPosts });
    }
  }, []);
  let addPost = useCallback((newPost: Post) => {
    dispatch({ type: 'ADD_POST', post: newPost });
  }, []);
  let updatePost = useCallback((newPost: Post) => {
    dispatch({ type: 'UPDATE_POST', post: newPost });
  }, []);
  return { isLoading, posts, error, fetchPosts, addPost, updatePost };
}

export { PostsProvider, usePostsState, usePostsDispatch };
