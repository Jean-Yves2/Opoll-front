import {
  createReducer,
  createAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

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
};

export const resetSnackbarStatusSignup = createAction('signup/RESET_SNACKBAR');
export const resetSignupSuccess = createAction('signup/RESET_SUCCESS');

export const handleSignup = createAsyncThunk(
  'signup/HANDLE_SIGNUP',
  async (credentials: SignUpState['credentials']) => {
    try {
      const response = await axios.post<User>(
        'http://localhost:3000/auth/register',
        credentials
      );
      return response.data;
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'inscription':", error);
      throw error;
    }
  }
);

const signupReducer = createReducer(initialValue, (builder) => {
  builder
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
      state.error = null;
    })
    .addCase(resetSnackbarStatusSignup, (state) => {
      state.snackbarSucess = false;
    });
});

export default signupReducer;
