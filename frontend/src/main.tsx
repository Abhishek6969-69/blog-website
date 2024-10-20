import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import store from './components/utils/store.ts'

import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
   <Provider store={store}>
    <App />
    </Provider>
  </BrowserRouter>
  </StrictMode>,
)
