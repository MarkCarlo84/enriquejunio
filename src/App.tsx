import { useState, useEffect, useCallback, useRef } from 'react'
import { businessCardConfig } from './config/businessCard'
import { BusinessCard } from './components/BusinessCard'
import { Toast } from './components/Toast'

function App() {
  const config = businessCardConfig

  // Always start in dark mode by default (unless config explicitly prefers light)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (config.themePreference === 'light') return 'light'
    return 'dark'
  })

  // Ephemeral toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastKey, setToastKey] = useState(0)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMessage(msg)
    setToastKey((k) => k + 1)
    toastTimer.current = setTimeout(() => setToastMessage(null), 2800)
  }, [])

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
  }, [])

  // Dynamic document title & theme synchronization
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('nfc_card_theme', theme)

    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#050505' : '#ededeb')
    }

    // Document Title
    document.title = config.businessName || config.fullName || 'Lorem Ipsum'
  }, [theme, config])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="page-viewport">
      {/* Layered monochrome backdrop: spotlight, hairline grid, film grain */}
      <div className="backdrop" aria-hidden="true">
        <div className="backdrop-spotlight" />
        <div className="backdrop-grid" />
        <div className="backdrop-grain" />
      </div>

      {/* Centered Business Card Container */}
      <main className="business-card-container">
        <BusinessCard
          config={config}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToast={showToast}
        />
      </main>

      {/* Ephemeral Feedback Toast */}
      <Toast message={toastMessage} toastKey={toastKey} />
    </div>
  )
}

export default App
