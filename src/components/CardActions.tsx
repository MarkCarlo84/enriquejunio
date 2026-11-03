import React, { useState } from 'react'
import { UserPlus, Share2, Check } from 'lucide-react'
import type { BusinessCardConfig } from '../types/businessCard'
import { downloadVCard } from '../utils/vcard'

interface CardActionsProps {
  config: BusinessCardConfig
  onToast: (message: string) => void
}

export const CardActions: React.FC<CardActionsProps> = ({ config, onToast }) => {
  const [isSaved, setIsSaved] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Handle Save Contact (.vcf download)
  const handleSaveContact = () => {
    try {
      downloadVCard(config)
      setIsSaved(true)
      onToast('Contact card downloaded successfully')
      setTimeout(() => setIsSaved(false), 2500)
    } catch {
      onToast('Could not save contact card')
    }
  }

  // Handle Share Digital Card (Web Share API with Clipboard copy fallback)
  const handleShare = async () => {
    const shareUrl = window.location.href
    const shareTitle = `${config.fullName} — ${config.businessName || config.professionalTitle}`
    const shareText =
      config.shortDescription || `Connect with ${config.fullName} via digital business card.`

    const shareData = {
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    }

    // Try native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (error) {
        // If user cancelled, do not trigger error
        if ((error as Error)?.name === 'AbortError') {
          return
        }
      }
    }

    // Fallback: Copy URL to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        const tempInput = document.createElement('textarea')
        tempInput.value = shareUrl
        tempInput.style.position = 'fixed'
        tempInput.style.opacity = '0'
        document.body.appendChild(tempInput)
        tempInput.focus()
        tempInput.select()
        document.execCommand('copy')
        document.body.removeChild(tempInput)
      }

      setIsCopied(true)
      onToast('Card link copied to clipboard')
      setTimeout(() => setIsCopied(false), 2500)
    } catch {
      onToast('Failed to copy card link')
    }
  }

  return (
    <div className="card-actions-wrapper" aria-label="Quick Actions">
      {/* Primary Action: Save Contact */}
      <button
        type="button"
        id="save-contact-btn"
        className={`action-btn action-btn-primary ${isSaved ? 'is-done' : ''}`}
        onClick={handleSaveContact}
        aria-label="Save contact to phone address book"
      >
        <span className="action-btn-shine" aria-hidden="true" />
        <span className="action-btn-icon" aria-hidden="true">
          {isSaved ? <Check size={18} strokeWidth={2.5} /> : <UserPlus size={18} strokeWidth={2} />}
        </span>
        <span className="action-btn-text">
          {isSaved ? 'Contact Saved' : 'Save Contact'}
        </span>
      </button>

      {/* Secondary Action: Share Digital Card */}
      <button
        type="button"
        id="share-card-btn"
        className={`action-btn action-btn-secondary ${isCopied ? 'is-done' : ''}`}
        onClick={handleShare}
        aria-label="Share digital business card"
      >
        <span className="action-btn-icon" aria-hidden="true">
          {isCopied ? <Check size={18} strokeWidth={2.5} /> : <Share2 size={17} strokeWidth={2} />}
        </span>
        <span className="action-btn-text">
          {isCopied ? 'Copied' : 'Share'}
        </span>
      </button>
    </div>
  )
}
