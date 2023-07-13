import {
  createReducer,
  createAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

interface LoginState {
  credentials: {
    email: string;
    password: string;
  };
  pseudo: string;
  isLogged?: boolean;
  loggedMessage?: string;
  error: string | null;
}

const initialValue: LoginState = {
  credentials: {
    email: '',
    password: '',
  },
  pseudo: '',
  isLogged: false,
  loggedMessage: 'Vous n"êtes pas connecté',
  error: null,
};

export type KeysOfCredentials = keyof LoginState['credentials'];

export const handleLogout = createAction('login/HANDLE_LOGOUT');

export const changeField = createAction<{
  name: KeysOfCredentials;
  value: string;
}>('login/CHANGE_FIELD');

export const handleLogin = createAsyncThunk(
  'settings/LOGIN',
  async (credentials: LoginState['credentials']) => {
    try {
      const { data } = await axios.post<{ pseudo: string }>(
        'https://orecipes-api.onrender.com/api/login',
        credentials
      );
      return data;
    } catch (error) {
      console.error("Une erreur s'est produite lors de la connexion:", error);
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
    .addCase(handleLogin.rejected, (state) => {
      state.error = 'Email ou mot de passe incorrect';
      state.isLogged = false;
    })
    .addCase(handleLogin.fulfilled, (state, action) => {
      state.pseudo = action.payload.pseudo;
      state.isLogged = true;
      state.loggedMessage = 'Vous êtes connecté';
      state.credentials.email = '';
      state.credentials.password = '';
    })
    .addCase(handleLogout, (state) => {
      state.isLogged = false;
      state.pseudo = '';
      state.loggedMessage = 'Vous n"êtes pas connecté';
    });
});

export default loginReducer;
