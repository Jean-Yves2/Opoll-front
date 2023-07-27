import {
  createReducer,
  createAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { act } from 'react-dom/test-utils';

interface ResponseData {
  message: string;
}

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
  id: number;
  isLogged: boolean;
  error: string | null;
  isLoading: boolean;
  snackbarSucess?: boolean;
  verificationCode: string;
  isVerified: boolean;
  verificationError: string | null;
  snackbarVerified?: boolean;
}

const initialValue: LoginState = {
  credentials: {
    email: '',
    password: '',
  },
  username: '',
  id: 0,
  isLogged: false,
  error: null,
  isLoading: false,
  snackbarSucess: false,
  verificationCode: '',
  isVerified: false,
  verificationError: null,
  snackbarVerified: false,
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

export const changeVerificationCode = createAction<string>(
  'login/CHANGE_VERIFICATION_CODE'
);

export const resetVerificationError = createAction(
  'login/resetVerificationError'
);

export const handleVerification = createAsyncThunk(
  'login/VERIFY',
  async (verificationCode: string, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('Token not found');
      const VerifCodeConfig = {
        method: 'post',
        url: 'http://localhost:3000/@me/verify',
        headers: {
          Authorization: token,
        },
        data: { code: verificationCode },
      };
      const response = await axios<ResponseData>(VerifCodeConfig);
      return { message: response.data.message };
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la vérification:",
        error
      );
      return rejectWithValue('Code de vérification incorrect');
    }
  }
);

export const handleLogin = createAsyncThunk(
  'settings/LOGIN',
  async (credentials: LoginState['credentials'], { rejectWithValue }) => {
    try {
      const { data } = await axios.post<{
        token: string;
        user: { username: string; id: number };
      }>('http://localhost:3000/auth/login', credentials);
      console.log(data);
      TypedCookies.set('token', data.token);
      return { username: data.user.username, id: data.user.id };
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
    .addCase(handleLogin.fulfilled, (state, action) => {
      state.isLogged = true;
      state.snackbarSucess = true;
      state.isLoading = false;
      state.credentials.email = '';
      state.credentials.password = '';
      state.error = null;
      state.username = action.payload.username;
      state.id = action.payload.id;
    })
    .addCase(handleLogout, (state) => {
      state.isLogged = false;
      state.isVerified = false;
      state.id = 0;
      state.username = '';
    })
    .addCase(resetLoginState, (state) => {
      state.credentials.email = '';
      state.credentials.password = '';
      state.error = null;
    })
    .addCase(resetSnackbarStatusLogin, (state) => {
      state.snackbarSucess = false;
      state.snackbarVerified = false;
    })
    .addCase(changeVerificationCode, (state, action) => {
      state.verificationCode = action.payload;
    })
    .addCase(handleVerification.pending, (state) => {
      state.isLoading = true;
      state.verificationError = null;
    })
    .addCase(handleVerification.rejected, (state, action) => {
      state.verificationError = action.payload as string;
      state.isVerified = false;
      state.isLoading = false;
    })
    .addCase(handleVerification.fulfilled, (state, action) => {
      if (action.payload.message === 'User verified') {
        state.isVerified = true;
        state.snackbarVerified = true;
      } else {
        state.verificationError = action.payload.message;
      }
      state.isLoading = false;
    })
    .addCase(resetVerificationError, (state) => {
      state.verificationError = null;
      state.verificationCode = '';
    });
});

export default loginReducer;
