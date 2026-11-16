import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.tsx'

// Le entrate allo scroll nascondono il contenuto solo se il browser sa osservarlo (vedi Reveal.tsx).
if ('IntersectionObserver' in window) document.documentElement.classList.add('reveal-ready')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* reducedMotion="user": con prefers-reduced-motion le animazioni di framer-motion si fermano */}
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
)
