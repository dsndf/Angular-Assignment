import { createReducer, on } from '@ngrx/store';
import {
  setIsAuth,
  setLoading,
  setUser,
  setWelcomeEnteredData,
} from './actions/auth.action';

export interface AuthState {
  isAuth: boolean;
  loading: boolean;
  welcomeEnteredData: {
    email: string;
    phone: string;
  };
  user: {
    fullname: string;
  } | null;
}

const initialState: AuthState = {
  isAuth: false,
  loading: false,
  welcomeEnteredData: {
    email: '',
    phone: '',
  },
  user: null,
};

export const authReducer = createReducer(
  initialState,
  on(setIsAuth, (state, action) => {
    return {...state,loading:action.payload};
  }),
  on(setLoading, (state, action) => {
    return {...state,loading:action.payload};
  }),
  on(setWelcomeEnteredData, (state, action) => {
    return {
      ...state,
      welcomeEnteredData: {
        ...action.payload,
      },
    };
  }),
  on(setUser, (state, action) => {
    return {
      ...state,
      user: {
        ...action.payload,
      },
    };
  })
);
