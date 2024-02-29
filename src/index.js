import { createRoot } from 'react-dom/client';
import App from './App';
import { StoreContext } from './store/context';
import Store from './store';

const store = new Store();

const root = createRoot(document.getElementById('root'));

// Первый рендер приложения
root.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>
);
