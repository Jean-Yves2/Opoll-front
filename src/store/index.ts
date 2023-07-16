import { configureStore, AnyAction } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import loginReducer from './reducers/login';
import signupReducer from './reducers/signup';
import storage from 'redux-persist/lib/storage';
import snackbarReducer from './reducers/snackbar';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, loginReducer);

export const store = configureStore({
  reducer: {
    login: persistedReducer,
    signup: signupReducer,
    snackbar: snackbarReducer,
  },
});

export default store;

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const dispatch = (action: AnyAction) => store.dispatch(action);
