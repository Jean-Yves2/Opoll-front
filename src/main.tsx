import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import App from './components/App/App';
import TokenExpirationChecker from './components/TokenExpirationChecker/TokenExpirationChecker';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TokenExpirationChecker />
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
