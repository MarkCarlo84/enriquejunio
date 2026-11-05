import React, { useEffect, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, Share2, Nfc } from 'lucide-react'
import type { BusinessCardConfig } from '../types/businessCard'
import { generateQrMatrix, generateQrSvgPath } from '../utils/qrCode'

interface QrCodeModalProps {
  isOpen: boolean
  onClose: () => void
  config: BusinessCardConfig
  onToast: (message: string) => void
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  config,
  onToast,
}) => {
  // Current page shareable URL
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return 'https://example.com'
    return window.location.href
  }, [])

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Generate QR vector path
  const qrData = useMemo(() => {
    try {
      const matrix = generateQrMatrix(shareUrl)
      return generateQrSvgPath(matrix, 3)
    } catch {
      const fallbackMatrix = generateQrMatrix('https://example.com')
      return generateQrSvgPath(fallbackMatrix, 3)
    }
  }, [shareUrl])

  // Copy link handler
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      onToast('Link copied to clipboard')
    } catch {
      onToast('Could not copy link')
    }
  }, [shareUrl, onToast])

  // Native share handler
  const handleNativeShare = useCallback(async () => {
    const title = `${config.displayName || config.fullName} — Digital Business Card`
    const text = `Connect with ${config.displayName || config.fullName} via digital NFC card.`

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl })
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') {
          handleCopy()
        }
      }
    } else {
      handleCopy()
    }
  }, [config, shareUrl, handleCopy])

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="experience-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      onClick={onClose}
    >
      <div
        className="experience-modal-content qr-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="experience-modal-header">
          <div className="experience-modal-title-group">
            <span className="experience-modal-tag">Instant Share</span>
            <h3 id="qr-modal-title" className="experience-modal-title">
              Scan QR Code
            </h3>
          </div>
          <button
            type="button"
            className="experience-modal-close-btn"
            onClick={onClose}
            aria-label="Close QR Code dialog"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="experience-modal-body qr-modal-body">
          {/* High-Contrast Crisp White QR Canvas Card */}
          <div className="qr-card-frame">
            <div className="qr-svg-wrapper">
              <svg
                viewBox={`0 0 ${qrData.size} ${qrData.size}`}
                className="qr-svg-image"
                shapeRendering="crispEdges"
                role="img"
                aria-label={`QR Code link to ${shareUrl}`}
              >
                {/* White background for 100% reliable camera scanner contrast */}
                <rect width={qrData.size} height={qrData.size} fill="#ffffff" />
                {/* Black QR Code modules */}
                <path d={qrData.path} fill="#000000" />
              </svg>

              {/* Center NFC emblem */}
              <div className="qr-center-emblem" aria-hidden="true">
                <div className="qr-center-emblem-inner">
                  <Nfc size={16} strokeWidth={2.4} />
                </div>
              </div>
            </div>

            <span className="qr-scan-hint">
              Point any camera at this QR code to view card
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="experience-modal-footer qr-modal-footer">
          <button
            type="button"
            className="qr-share-btn"
            onClick={handleNativeShare}
          >
            <Share2 size={14} strokeWidth={2.2} />
            <span>Share Link</span>
          </button>

          <button
            type="button"
            className="experience-modal-done-btn"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

