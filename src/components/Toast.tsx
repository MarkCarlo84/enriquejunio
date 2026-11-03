import React from 'react'
import { Check } from 'lucide-react'

interface ToastProps {
  message: string | null
  /** Changes on every toast so the entrance animation replays */
  toastKey?: number
}

export const Toast: React.FC<ToastProps> = ({ message, toastKey }) => {
  if (!message) return null

  return (
    <div className="toast-container" role="status" aria-live="polite" key={toastKey}>
      <div className="toast-bubble">
        <span className="toast-icon" aria-hidden="true">
          <Check size={12} strokeWidth={3} />
        </span>
        <span className="toast-text">{message}</span>
      </div>
    </div>
  )
}
