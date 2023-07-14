import { configureStore, AnyAction } from '@reduxjs/toolkit';
import loginReducer from './reducers/login';
import signupReducer from './reducers/signup';

const store = configureStore({
  reducer: {
    login: loginReducer,
    signup: signupReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const dispatch = (action: AnyAction) => store.dispatch(action);
