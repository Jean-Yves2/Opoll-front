import {
  createReducer,
  createAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

interface CookieAttributes {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

interface CookiesType {
  set: (name: string, value: string, options?: CookieAttributes) => void;
  remove: (name: string, options?: CookieAttributes) => void;
}

interface LoginState {
  credentials: {
    email: string;
    password: string;
  };
  username: string;
  isLogged: boolean;
  loggedMessage?: string;
  error: string | null;
  open: boolean;
  isLoading: boolean;
}

const initialValue: LoginState = {
  credentials: {
    email: '',
    password: '',
  },
  username: '',
  isLogged: false,
  loggedMessage: 'Vous n"êtes pas connecté',
  error: null,
  open: false,
  isLoading: false,
};

const TypedCookies: CookiesType = Cookies;

export type KeysOfCredentials = keyof LoginState['credentials'];

export const toggleModal = createAction<boolean>('login/TOGGLE_MODAL');

export const handleLogout = createAction('login/HANDLE_LOGOUT', () => {
  TypedCookies.remove('token');
  return { payload: undefined };
});

export const changeField = createAction<{
  name: KeysOfCredentials;
  value: string;
}>('login/CHANGE_FIELD');

export const handleLogin = createAsyncThunk(
  'settings/LOGIN',
  async (credentials: LoginState['credentials'], { rejectWithValue }) => {
    try {
      const { data } = await axios.post<{ token: string; username: string }>(
        'http://localhost:3000/auth/login',
        credentials
      );
      TypedCookies.set('token', data.token);
      return { username: data.username };
    } catch (error) {
      console.error("Une erreur s'est produite lors de la connexion:", error);
      return rejectWithValue('Email ou mot de passe incorrect');
      throw error;
    }
  }
);

const loginReducer = createReducer(initialValue, (builder) => {
  builder
    .addCase(toggleModal, (state, action) => {
      state.open = action.payload;
    })
    .addCase(changeField, (state, action) => {
      const { name, value } = action.payload;
      state.credentials[name] = value;
    })
    .addCase(handleLogin.pending, (state) => {
      // Lorsque mon appel API se lance
      // Je dis que je suis en train de charger
      state.isLoading = true;
      // Si j'avais eu une erreur précédente, je la supprime
      state.error = null;
    })
    .addCase(handleLogin.rejected, (state) => {
      state.error = 'Email ou mot de passe incorrect';
      state.isLogged = false;
      state.isLoading = false;
    })
    .addCase(handleLogin.fulfilled, (state) => {
      state.isLogged = true;
      state.loggedMessage = 'Vous êtes connecté';
      state.credentials.email = '';
      state.credentials.password = '';
      state.open = false;
      state.isLoading = false;
    })
    .addCase(handleLogout, (state) => {
      state.isLogged = false;
      state.loggedMessage = 'Vous n"êtes pas connecté';
    });
});

export default loginReducer;
