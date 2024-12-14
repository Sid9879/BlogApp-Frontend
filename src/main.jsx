import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { RouterProvider } from 'react-router-dom'
import { store } from './store/store.jsx'
import { Provider } from 'react-redux'
import ErrorBoundary from './ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ErrorBoundary>
    <App />

    </ErrorBoundary>
  </Provider>
)
