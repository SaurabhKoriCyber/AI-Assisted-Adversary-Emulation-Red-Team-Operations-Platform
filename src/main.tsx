import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Motion logs an informational dev notice when the OS has Reduced Motion on. The app already
// honours that setting (MotionConfig reducedMotion="user" + useCalm), so the notice is noise.
if (import.meta.env.DEV) {
  const warn = console.warn.bind(console)
  console.warn = (...a: unknown[]) => {
    if (typeof a[0] === 'string' && a[0].includes('Reduced Motion enabled on your device')) return
    warn(...a)
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)