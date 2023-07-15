import {
  createReducer,
  createAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

interface SignUpState {
  credentials: {
    username: string;
    email: string;
    password: string;
    passwordConfirm?: string;
  };
  error: string | null;
  open: boolean;
  isLoading: boolean;
  isSucess: boolean;
}

const initialValue: SignUpState = {
  credentials: {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  },
  error: null,
  open: false,
  isLoading: false,
  isSucess: false,
};

export type KeysOfCredentials = keyof SignUpState['credentials'];

export const toggleModal = createAction<boolean>('signup/TOGGLE_MODAL');

export const changeField = createAction<{
  name: KeysOfCredentials;
  value: string;
}>('signup/CHANGE_FIELD');

export const handleSignup = createAsyncThunk(
  'settings/SIGNUP',
  async (credentials: SignUpState['credentials']) => {
    try {
      const data = await axios.post(
        'http://localhost:3000/auth/register',
        credentials
      );
      return data;
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'inscription':", error);
      throw error;
    }
  }
);

const signupReducer = createReducer(initialValue, (builder) => {
  builder
    .addCase(toggleModal, (state, action) => {
      state.open = action.payload;
    })
    .addCase(changeField, (state, action) => {
      const { name, value } = action.payload;
      state.credentials[name] = value;
    })
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
      state.error = null;
      state.credentials.email = '';
      state.credentials.username = '';
      state.credentials.password = '';
      state.credentials.passwordConfirm = '';
      state.open = false;
      state.isLoading = false;
      state.isSucess = true;
    });
});

export default signupReducer;