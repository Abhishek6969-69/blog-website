import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import store from './utils/store.ts'

import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux";
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Provider store={store}>
    <BrowserRouter>
    <ReactNotifications />
    <App />
    
  
  </BrowserRouter>
  </Provider>
  </StrictMode>,
)
