import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
} from 'react';

import { User } from '../types/types';

type State = {
  isLoading: boolean;
  user: User;
  error: string;
};
type Action =
  | { type: 'USER_RECEIVED'; user: User }
  | { type: 'REMOVE_USER' }
  | { type: 'ERROR_RECEIVED'; error: string }
  | { type: 'START_LOADING' };
type Dispatch = React.Dispatch<Action>;

const defaultState: State = {
  isLoading: false,
  user: {
    id: '',
    name: '',
    email: '',
    photo: '',
  },
  error: '',
};

let CurrentUserStateContext = createContext<State | null>(null);
let CurrentUserDispatchContext = createContext<Dispatch | null>(null);

function currentUserReducer(state: State, action: Action) {
  switch (action.type) {
    case 'USER_RECEIVED':
      return {
        ...state,
        isLoading: false,
        user: action.user,
      };
    case 'START_LOADING':
      return { ...state, isLoading: true };
    case 'ERROR_RECEIVED':
      return { ...state, isLoading: false, error: action.error };
    case 'REMOVE_USER':
      return defaultState;
    default:
      return state;
  }
}

function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  let [state, dispatch] = useReducer(currentUserReducer, defaultState);
  return (
    <CurrentUserStateContext.Provider value={state}>
      <CurrentUserDispatchContext.Provider value={dispatch}>
        {children}
      </CurrentUserDispatchContext.Provider>
    </CurrentUserStateContext.Provider>
  );
}

function useCurrentUserState() {
  let context = useContext(CurrentUserStateContext);
  if (context === null) {
    throw new Error('useCurrentUserState must be used within a Provider');
  }
  return context;
}

function useCurrentUserDispatch() {
  let context = useContext(CurrentUserDispatchContext);
  if (context === null) {
    throw new Error('useCurrentUserDispatch must be used within a Provider');
  }
  return context;
}

function useCurrentUser() {
  let { isLoading, error, user } = useCurrentUserState();
  let dispatch = useCurrentUserDispatch();
  let saveCurrentUser = useCallback((user: User) => {
    dispatch({ type: 'USER_RECEIVED', user });
  }, []);
  let clearCurrentUser = useCallback(() => {
    dispatch({ type: 'REMOVE_USER' });
  }, []);
  return { isLoading, error, user, saveCurrentUser, clearCurrentUser };
}

export {
  CurrentUserProvider,
  useCurrentUserState,
  useCurrentUserDispatch,
  useCurrentUser,
};
