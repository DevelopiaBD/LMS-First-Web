
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import { ApiContextProvider } from '../Utils/ApiContext.jsx'
import { DashBoardContextProvider } from '../Utils/DashBoardContext.jsx'



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ApiContextProvider>
      <DashBoardContextProvider>
      <App />
      </DashBoardContextProvider>
    </ApiContextProvider>
  </BrowserRouter>
)