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
  error: string | null;
  isLoading: boolean;
  snackbarSucess?: boolean;
}

const initialValue: LoginState = {
  credentials: {
    email: '',
    password: '',
  },
  username: '',
  isLogged: false,
  error: null,
  isLoading: false,
  snackbarSucess: false,
};

const TypedCookies: CookiesType = Cookies;

export type KeysOfCredentials = keyof LoginState['credentials'];

export const resetSnackbarStatusLogin = createAction('signup/RESET_SNACKBAR');
export const resetLoginState = createAction('login/RESET_STATE');

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
      console.log(data.token);

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
    .addCase(changeField, (state, action) => {
      const { name, value } = action.payload;
      state.credentials[name] = value;
    })
    .addCase(handleLogin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(handleLogin.rejected, (state, action) => {
      state.error = action.payload as string;
      state.isLogged = false;
      state.isLoading = false;
    })
    .addCase(handleLogin.fulfilled, (state) => {
      state.isLogged = true;
      state.snackbarSucess = true;
      state.isLoading = false;
      state.credentials.email = '';
      state.credentials.password = '';
      state.error = null;
    })
    .addCase(handleLogout, (state) => {
      state.isLogged = false;
    })
    .addCase(resetLoginState, (state) => {
      state.credentials.email = '';
      state.credentials.password = '';
      state.error = null;
    })
    .addCase(resetSnackbarStatusLogin, (state) => {
      state.snackbarSucess = false;
    });
});

export default loginReducer;
