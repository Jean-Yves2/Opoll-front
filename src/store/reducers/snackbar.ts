import { createReducer, createAction } from '@reduxjs/toolkit';

interface SnackbarState {
  isLogged: boolean;
}

const initialValue: SnackbarState = {
  isLogged: false,
};

export const setSnackbarLogged = createAction<boolean>('snackbar/setLogged');

export const resetSnackbar = createAction('snackbar/reset');

const snackbarReducer = createReducer(initialValue, (builder) => {
  builder
    .addCase(setSnackbarLogged, (state, action) => {
      state.isLogged = action.payload;
    })
    .addCase(resetSnackbar, (state) => {
      state.isLogged = true;
    });
});

export default snackbarReducer;
