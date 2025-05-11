

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import BlogEditor from '../src/components/Texteditor';

const root = createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <BlogEditor />
  </Provider>
);