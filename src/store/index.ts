import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/login';
import signupReducer from './reducers/signup';
import snackbarReducer from './reducers/snackbar';

// Configuration de la persistance pour le state isLogged uniquement
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['isLogged'], // Inclure seulement le state isLogged pour des raisons de sécurité
};

// Création des reducers persistants
const persistedLoginReducer = persistReducer(persistConfig, loginReducer);

// Configuration du store avec les reducers persistants
export const store = configureStore({
  reducer: {
    login: persistedLoginReducer,
    signup: signupReducer,
    snackbar: snackbarReducer,
  },
});

// Création du persistor pour la persistance
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
