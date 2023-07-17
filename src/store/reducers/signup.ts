import {
  createReducer,
  createAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleLogin } from './login';

interface User {
  id: number;
  username: string;
  email: string;
}

interface SignUpState {
  credentials: {
    username: string;
    email: string;
    password: string;
    passwordConfirm?: string;
  };
  error: string | null;
  isLoading: boolean;
  snackbarSucess: boolean;
  isSignupSuccess: boolean;
}

const initialValue: SignUpState = {
  credentials: {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  },
  error: null,
  isLoading: false,
  snackbarSucess: false,
  isSignupSuccess: false,
};

export type KeysOfCredentials = keyof SignUpState['credentials'];

export const resetSignupState = createAction('signup/RESET_STATE');

export const changeField = createAction<{
  name: KeysOfCredentials;
  value: string;
}>('signup/CHANGE_FIELD');

export const handleSignup = createAsyncThunk(
  'signup/HANDLE_SIGNUP',
  async (credentials: SignUpState['credentials'], { dispatch }) => {
    try {
      const response = await axios.post<User>(
        'http://localhost:3000/auth/register',
        credentials
      );
      await dispatch(handleLogin(credentials));

      return response.data;
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'inscription':", error);
      throw error;
    }
  }
);

const signupReducer = createReducer(initialValue, (builder) => {
  builder
    .addCase(
      changeField,
      (
        state,
        action: PayloadAction<{ name: KeysOfCredentials; value: string }>
      ) => {
        const { name, value } = action.payload;
        state.credentials = { ...state.credentials, [name]: value };
      }
    )
    .addCase(handleSignup.pending, (state) => {
      // Lorsque mon appel API se lance
      // Je dis que je suis en train de charger
      state.isLoading = true;
      // Si j'avais eu une erreur précédente, je la supprime
      state.error = null;
    })
    .addCase(handleSignup.rejected, (state) => {
      state.error =
        'Cette email ou cette utilisateur existe déjà en base de données';
      state.isLoading = false;
    })
    .addCase(handleSignup.fulfilled, (state) => {
      state.isLoading = false;
      state.snackbarSucess = true;
      state.credentials.email = '';
      state.credentials.username = '';
      state.credentials.password = '';
      state.credentials.passwordConfirm = '';
      state.isSignupSuccess = true;
      state.error = null;
    })
    .addCase(resetSignupState, (state) => {
      state.credentials.email = '';
      state.credentials.username = '';
      state.credentials.password = '';
      state.credentials.passwordConfirm = '';
      state.snackbarSucess = false;
      state.error = null;
    });
});

export default signupReducer;
