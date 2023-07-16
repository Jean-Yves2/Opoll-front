import { createReducer, createAction } from '@reduxjs/toolkit';

interface SnackbarState {
  isLogged: boolean;
}

const initialValue: SnackbarState = {
  isLogged: false,
};

export const setSnackbarLogged = createAction<boolean>('snackbar/setLogged');

const snackbarReducer = createReducer(initialValue, (builder) => {
  builder.addCase(setSnackbarLogged, (state, action) => {
    state.isLogged = action.payload;
  });
});

export default snackbarReducer;
