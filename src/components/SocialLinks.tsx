import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { BusinessCardConfig } from '../types/businessCard'
import { SectionHeader } from './SectionHeader'

interface SocialLinksProps {
  config: BusinessCardConfig
  index: string
}

/** Extracts a readable handle from a profile URL or email */
function handleFromUrl(url: string): string {
  try {
    if (url.startsWith('mailto:')) {
      return url.replace('mailto:', '').split('?')[0]
    }
    if (url.includes('@') && !url.startsWith('http')) {
      return url
    }
    const parsed = new URL(url)
    const toParam = parsed.searchParams.get('to')
    if (toParam) return toParam
    const path = parsed.pathname.replace(/\/+$/, '')
    return path.split('/').filter(Boolean).pop() || ''
  } catch {
    return url.replace(/^mailto:/, '')
  }
}

const GmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

export const SocialLinks: React.FC<SocialLinksProps> = ({ config, index }) => {
  const rawGmail = (config.gmailUrl || config.instagramUrl || '').trim()
  const gmailUrl = rawGmail
    ? (rawGmail.startsWith('http') || rawGmail.startsWith('mailto:')
        ? rawGmail
        : rawGmail.includes('@')
          ? `mailto:${rawGmail}`
          : `https://mail.google.com/mail/?view=cm&fs=1&to=${rawGmail}`)
    : (config.emailAddress ? `mailto:${config.emailAddress}` : '')

  const links = [
    { key: 'gmail', name: 'Gmail', url: gmailUrl, icon: <GmailIcon /> },
    { key: 'facebook', name: 'Facebook', url: config.facebookUrl?.trim(), icon: <FacebookIcon /> },
  ].filter((l): l is typeof l & { url: string } => Boolean(l.url))

  // Only render if at least one platform is configured
  if (links.length === 0) return null

  return (
    <section className="panel social-panel" aria-labelledby="social-heading">
      <SectionHeader index={index} title="Find me" accent="Online" id="social-heading" />

      <div className="social-grid" style={{ gridTemplateColumns: `repeat(${links.length}, 1fr)` }}>
        {links.map((link) => {
          const handle = handleFromUrl(link.url)
          return (
            <a
              key={link.key}
              id={`social-${link.key}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-tile"
              aria-label={`Visit ${config.displayName || config.fullName}'s ${link.name} profile`}
            >
              <ArrowUpRight size={13} className="social-tile-arrow" aria-hidden="true" />
              <span className="social-tile-icon" aria-hidden="true">
                {link.icon}
              </span>
              <span className="social-tile-name">{link.name}</span>
              {handle && (
                <span className="social-tile-handle">
                  {handle.includes('@') ? handle : `@${handle}`}
                </span>
              )}
            </a>
          )
        })}
      </div>
    </section>
  )
}
