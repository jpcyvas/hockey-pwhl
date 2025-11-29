import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// PrimeReact CSS (choose theme as desired)
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)