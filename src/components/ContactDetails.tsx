import React, { useState } from 'react'
import { Phone, Mail, MapPin, Copy, Check, ArrowUpRight } from 'lucide-react'
import type { BusinessCardConfig } from '../types/businessCard'
import { SectionHeader } from './SectionHeader'

interface ContactDetailsProps {
  config: BusinessCardConfig
  index: string
  onToast: (message: string) => void
}

interface ContactRow {
  key: string
  label: string
  value: string
  href: string
  icon: React.ReactNode
  external?: boolean
  copyValue?: string
  ariaLabel: string
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({ config, index, onToast }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const phoneDisplay = (config.phoneNumber || config.phoneRaw || '').trim()
  const phoneRaw = (config.phoneRaw || config.phoneNumber || '').replace(/\s+/g, '')
  const email = config.emailAddress?.trim() || ''
  const address = config.businessAddress?.trim() || ''

  const rows: ContactRow[] = []

  if (phoneDisplay) {
    rows.push({
      key: 'phone',
      label: 'Mobile',
      value: phoneDisplay,
      href: `tel:${phoneRaw}`,
      icon: <Phone size={17} strokeWidth={1.9} />,
      copyValue: phoneRaw,
      ariaLabel: `Call ${phoneDisplay}`,
    })
  }

  if (email) {
    rows.push({
      key: 'email',
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
      icon: <Mail size={17} strokeWidth={1.9} />,
      copyValue: email,
      ariaLabel: `Send email to ${email}`,
    })
  }

  if (address) {
    rows.push({
      key: 'location',
      label: 'Location',
      value: address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      icon: <MapPin size={17} strokeWidth={1.9} />,
      external: true,
      ariaLabel: `View address on map: ${address}`,
    })
  }

  // If no contact fields are configured, do not render this section at all
  if (rows.length === 0) return null

  const handleCopy = async (row: ContactRow) => {
    if (!row.copyValue) return
    try {
      await navigator.clipboard.writeText(row.copyValue)
      setCopiedKey(row.key)
      onToast(`${row.label} copied to clipboard`)
      setTimeout(() => setCopiedKey((k) => (k === row.key ? null : k)), 2000)
    } catch {
      onToast(`Could not copy ${row.label.toLowerCase()}`)
    }
  }

  return (
    <section className="panel contact-panel" aria-labelledby="contact-heading">
      <SectionHeader index={index} title="Get in" accent="Touch" id="contact-heading" />

      <ul className="contact-list">
        {rows.map((row) => (
          <li key={row.key} className="contact-row">
            <a
              href={row.href}
              id={`contact-${row.key}`}
              className="contact-link"
              aria-label={row.ariaLabel}
              {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="contact-icon-box" aria-hidden="true">
                {row.icon}
              </span>
              <span className="contact-content">
                <span className="contact-label">{row.label}</span>
                <span className="contact-value">{row.value}</span>
              </span>
              {!row.copyValue && (
                <ArrowUpRight size={16} className="contact-arrow" aria-hidden="true" />
              )}
            </a>

            {row.copyValue && (
              <button
                type="button"
                id={`copy-${row.key}`}
                className={`contact-copy ${copiedKey === row.key ? 'is-copied' : ''}`}
                onClick={() => handleCopy(row)}
                aria-label={`Copy ${row.label.toLowerCase()}`}
                title={`Copy ${row.label.toLowerCase()}`}
              >
                {copiedKey === row.key ? (
                  <Check size={15} strokeWidth={2.6} />
                ) : (
                  <Copy size={15} strokeWidth={2} />
                )}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
