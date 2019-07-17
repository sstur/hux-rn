import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';
import { AsyncStorage } from 'react-native';

import fetchFromAPI from '../helpers/fetchFromAPI';
import { Comment } from '../types/types';

type State = {
  isLoading: boolean;
  commentsByPost: Map<string, Array<Comment>>;
  error: string | null;
};

type Action =
  | {
      type: 'START_LOADING';
    }
  | {
      type: 'COMMENTS_RECEIVED';
      postID: string;
      comments: Array<Comment>;
    }
  | {
      type: 'ERROR_RECEIVED';
      error: string;
    }
  | {
      type: 'ADD_COMMENT';
      postID: string;
      comment: Comment;
    };

type Dispatch = React.Dispatch<Action>;

let CommentsStateContext = createContext<State | null>(null);
let CommentsDispatchContext = createContext<Dispatch | null>(null);

function commentsReducer(state: State, action: Action) {
  switch (action.type) {
    case 'START_LOADING': {
      return { ...state, isLoading: true, error: null };
    }
    case 'COMMENTS_RECEIVED': {
      let { commentsByPost } = state;
      // Make a copy before mutating.
      commentsByPost = new Map(commentsByPost);
      commentsByPost.set(action.postID, action.comments);
      return { ...state, isLoading: false, commentsByPost };
    }
    case 'ERROR_RECEIVED': {
      return { ...state, isLoading: false, error: action.error };
    }
    case 'ADD_COMMENT': {
      let { commentsByPost } = state;
      // Make a copy before mutating.
      let comments = commentsByPost.get(action.postID) || [];
      comments.push(action.comment);
      commentsByPost.set(action.postID, comments);
      return { ...state, isLoading: false, commentsByPost };
    }
    default: {
      return state;
    }
  }
}

function CommentsProvider({ children }: { children: React.ReactNode }) {
  let [state, dispatch] = useReducer(commentsReducer, {
    isLoading: false,
    commentsByPost: new Map(),
    error: null,
  });
  return (
    <CommentsStateContext.Provider value={state}>
      <CommentsDispatchContext.Provider value={dispatch}>
        {children}
      </CommentsDispatchContext.Provider>
    </CommentsStateContext.Provider>
  );
}

function useCommentsState() {
  let context = useContext(CommentsStateContext);
  if (context === null) {
    throw new Error('useCommentsState must be used within a Provider');
  }
  return context;
}
function useCommentsDispatch() {
  let context = useContext(CommentsDispatchContext);
  if (context === null) {
    throw new Error('useCommentsDispatch must be used within a Provider');
  }
  return context;
}

export function useComments(postID: string) {
  let { isLoading, commentsByPost, error } = useCommentsState();
  let dispatch = useCommentsDispatch();
  let fetchComments = useCallback(async () => {
    dispatch({ type: 'START_LOADING' });
    let authToken = await AsyncStorage.getItem('@authToken');
    let result = await fetchFromAPI(`/posts/${postID}/comments`, {
      headers: { 'X-Auth': authToken || '' },
    });
    if (result.isError) {
      dispatch({ type: 'ERROR_RECEIVED', error: result.errorMessage });
    } else {
      let newComments = result.data.comments as Array<Comment>;
      dispatch({ type: 'COMMENTS_RECEIVED', postID, comments: newComments });
    }
  }, []);
  let addComment = useCallback((comment) => {
    dispatch({ type: 'ADD_COMMENT', postID, comment });
  }, []);
  let comments = commentsByPost.get(postID) || [];
  return { isLoading, comments, error, fetchComments, addComment };
}

export { CommentsProvider, useCommentsState, useCommentsDispatch };
