import { createReducer, createAction } from '@reduxjs/toolkit';

interface SnackbarState {
  isLogged: boolean;
  isExpired?: boolean;
  ExpiredMessage?: string;
}

const initialValue: SnackbarState = {
  isLogged: true,
  isExpired: false,
};

export const showSnackbar = createAction('snackbar/show');
export const resetSnackbar = createAction('snackbar/reset');
export const expiredToken = createAction('snackbar/expired');

const snackbarReducer = createReducer(initialValue, (builder) => {
  builder
    .addCase(showSnackbar, (state) => {
      state.isLogged = false;
    })
    .addCase(resetSnackbar, (state) => {
      state.isLogged = true;
      state.isExpired = false;
    })
    .addCase(expiredToken, (state) => {
      state.isExpired = true;
    });
});

export default snackbarReducer;
