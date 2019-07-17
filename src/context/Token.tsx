import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
} from 'react';
import { AsyncStorage } from 'react-native';
import fetchFromAPI from '../helpers/fetchFromAPI';
import { useCurrentUser } from './CurrentUser';

import { User } from '../types/types';

type State = {
  isLoading: boolean;
  authToken: string;
  error: string;
};
type Action =
  | { type: 'TOKEN_RECEIVED'; authToken: string }
  | { type: 'REMOVE_TOKEN' }
  | { type: 'ERROR_RECEIVED'; error: string }
  | { type: 'START_LOADING' };
type Dispatch = React.Dispatch<Action>;

const defaultState: State = {
  isLoading: false,
  authToken: '',
  error: '',
};

let TokenStateContext = createContext<State | null>(null);
let TokenDispatchContext = createContext<Dispatch | null>(null);

function tokenReducer(state: State, action: Action) {
  switch (action.type) {
    case 'TOKEN_RECEIVED':
      return {
        ...state,
        isLoading: false,
        error: '',
        authToken: action.authToken,
      };
    case 'START_LOADING':
      return { ...state, isLoading: true, error: '' };
    case 'ERROR_RECEIVED':
      return { ...state, isLoading: false, error: action.error };
    case 'REMOVE_TOKEN':
      return defaultState;
    default:
      return state;
  }
}

function TokenProvider({ children }: { children: React.ReactNode }) {
  let [state, dispatch] = useReducer(tokenReducer, defaultState);
  return (
    <TokenStateContext.Provider value={state}>
      <TokenDispatchContext.Provider value={dispatch}>
        {children}
      </TokenDispatchContext.Provider>
    </TokenStateContext.Provider>
  );
}

function useTokenState() {
  let context = useContext(TokenStateContext);
  if (context === null) {
    throw new Error('useTokenState must be used within a Provider');
  }
  return context;
}

function useTokenDispatch() {
  let context = useContext(TokenDispatchContext);
  if (context === null) {
    throw new Error('useTokenDispatch must be used within a Provider');
  }
  return context;
}

type LoginResult = {
  authToken: string;
  success: boolean;
  user: User;
};
function useToken() {
  let { saveCurrentUser } = useCurrentUser();
  let { isLoading, error, authToken } = useTokenState();
  let dispatch = useTokenDispatch();
  let login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'START_LOADING' });
    let result = await fetchFromAPI('/auth', {
      method: 'POST',
      body: { email, password },
    });
    if (result.isError) {
      dispatch({
        type: 'ERROR_RECEIVED',
        error: result.errorMessage,
      });
      return;
    }
    let data = result.data as LoginResult;
    if (data.success) {
      dispatch({
        type: 'TOKEN_RECEIVED',
        authToken: data.authToken,
      });
      await AsyncStorage.setItem('@authToken', data.authToken);
      saveCurrentUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        photo: data.user.photo,
      });
    } else {
      dispatch({
        type: 'ERROR_RECEIVED',
        error: 'Incorrect email or password.',
      });
    }
  }, []);
  let clearToken = useCallback(async () => {
    await AsyncStorage.removeItem('@authToken');
    dispatch({ type: 'REMOVE_TOKEN' });
  }, []);
  let saveToken = useCallback((authToken: string) => {
    dispatch({ type: 'TOKEN_RECEIVED', authToken });
  }, []);
  return { isLoading, error, authToken, login, saveToken, clearToken };
}

export { TokenProvider, useTokenState, useTokenDispatch, useToken };
