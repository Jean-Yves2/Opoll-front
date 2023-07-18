import { createReducer, createAction } from '@reduxjs/toolkit';

interface SnackbarState {
  isLogged: boolean;
}

const initialValue: SnackbarState = {
  isLogged: true,
};

export const showSnackbar = createAction('snackbar/show');
export const resetSnackbar = createAction('snackbar/reset');

const snackbarReducer = createReducer(initialValue, (builder) => {
  builder
    .addCase(showSnackbar, (state) => {
      state.isLogged = false;
    })
    .addCase(resetSnackbar, (state) => {
      state.isLogged = true;
    });
});

export default snackbarReducer;
