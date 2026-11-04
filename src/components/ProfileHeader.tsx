import React from 'react'
import type { BusinessCardConfig } from '../types/businessCard'
import { BadgeCheck, User } from 'lucide-react'

interface ProfileHeaderProps {
  config: BusinessCardConfig
  /** Permanent profile portrait */
  avatarSrc?: string
  projectCount?: number | string
}

/** "Bachelor of Science in Information Technology" -> "BSIT" */
function degreeAcronym(degree?: string): string | null {
  if (!degree?.trim()) return null
  const stop = new Set(['of', 'in', 'and', 'the', '&'])
  return degree
    .split(/\s+/)
    .filter((w) => w && !stop.has(w.toLowerCase()))
    .map((w) => w[0].toUpperCase())
    .join('')
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  config,
  avatarSrc,
  projectCount = 0,
}) => {
  const photo = avatarSrc || config.profileImage
  const hasAvatar = Boolean(photo?.trim())
  const hasDescription = Boolean(config.shortDescription?.trim())

  // Real name leads (it's a business card); brand handle sits beneath it
  const primaryName = config.displayName?.trim() || config.fullName
  const handle =
    config.displayName?.trim() && config.displayName !== config.fullName ? config.fullName : null

  // Quick-facts strip
  const highestDegree =
    config.education && config.education.length > 0
      ? config.education[config.education.length - 1].degree
      : config.profileInfo?.degree
  const degree =
    config.education && config.education.length > 1
      ? 'MA & BS'
      : degreeAcronym(highestDegree)
  const city = config.businessAddress?.split(',')[0]?.trim()
  const displayProjectCount =
    config.projectsCount != null
      ? String(config.projectsCount)
      : typeof projectCount === 'number' && projectCount > 0
        ? String(projectCount).padStart(2, '0')
        : projectCount
          ? String(projectCount)
          : null

  const facts = [
    degree && { label: 'Degree', value: degree },
    displayProjectCount && { label: 'NC II', value: displayProjectCount },
    city && { label: 'Based in', value: city },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <header className="card-header">
      {/* Obsidian Glass Backdrop behind profile — authentic banner glass effect */}
      <div className="header-banner header-banner--glass" aria-hidden="true">
        <div className="banner-noise" aria-hidden="true" />
        <div className="banner-spotlight" aria-hidden="true" />
        <div className="banner-lines" aria-hidden="true" />
        <div className="banner-sweep" aria-hidden="true" />

        {/* Precision Card Edge & Corner Notches */}
        <span className="banner-corner-mark banner-corner-tl" aria-hidden="true" />
        <span className="banner-corner-mark banner-corner-bl" aria-hidden="true" />
        <span className="banner-corner-mark banner-corner-br" aria-hidden="true" />

        {/* Top meta row with status badge */}
        <div className="banner-meta-row">
          <div className="banner-meta-left">
            <span className="banner-meta-tag">
              <span className="banner-nfc-pulse" aria-hidden="true" />
              <span>Active</span>
            </span>
          </div>
        </div>

        {/* Ambient Center Glow & Animated NFC Pulse Waves behind Avatar */}
        <div className="banner-glass-center-glow" aria-hidden="true" />
        <div className="nfc-pulse-waves" aria-hidden="true">
          <span className="nfc-wave nfc-wave--1" />
          <span className="nfc-wave nfc-wave--2" />
          <span className="nfc-wave nfc-wave--3" />
        </div>

        {/* Soft bottom vignette for smooth gradient transition into avatar overlap */}
        <div className="banner-bottom-vignette" aria-hidden="true" />
      </div>

      {/* Overlapping Profile Avatar Circle — kept intact, placeholder when image is removed */}
      <div className="avatar-overlap-container">
        <div className="avatar-ring" aria-hidden="true" />
        <div className="avatar-frame">
          {hasAvatar ? (
            <img
              key={photo}
              src={photo}
              alt={primaryName}
              className="avatar-image"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="avatar-placeholder" aria-label="Profile avatar placeholder">
              <User size={46} strokeWidth={1.5} className="avatar-placeholder-icon" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="graduate-verified-badge" title="Verified Profile">
          <BadgeCheck size={16} strokeWidth={2.4} aria-hidden="true" />
        </div>
      </div>

      {/* Primary Identity Information */}
      <div className="identity-block">
        {config.availability?.trim() && (
          <span className="availability-pill">
            <span className="availability-dot" aria-hidden="true" />
            {config.availability}
          </span>
        )}

        <h1 className="owner-name">{primaryName}</h1>

        {handle && <span className="owner-handle">@{handle}</span>}

        {config.professionalTitle?.trim() && (
          <p className="owner-title">{config.professionalTitle}</p>
        )}

        {hasDescription && <p className="owner-bio">{config.shortDescription}</p>}

        {facts.length > 0 && (
          <dl className="quick-facts" style={{ gridTemplateColumns: `repeat(${facts.length}, 1fr)` }}>
            {facts.map((f) => (
              <div className="quick-fact" key={f.label}>
                <dt className="quick-fact-label">{f.label}</dt>
                <dd className="quick-fact-value">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  )
}
