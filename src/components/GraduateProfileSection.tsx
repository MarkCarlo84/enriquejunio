import React from 'react'
import type { BusinessCardConfig } from '../types/businessCard'
import { SectionHeader } from './SectionHeader'

interface GraduateProfileSectionProps {
  config: BusinessCardConfig
  index: string
}

export const GraduateProfileSection: React.FC<GraduateProfileSectionProps> = ({
  config,
  index,
}) => {
  const profile = config.profileInfo
  if (!profile || !profile.bio?.trim()) return null

  return (
    <section className="panel profile-panel" aria-labelledby="profile-heading">
      <SectionHeader
        index={index}
        title="About"
        accent="Overview"
        id="profile-heading"
        meta={<span className="meta-chip meta-chip-solid">Biography</span>}
      />

      {/* Professional Biography */}
      <p className="panel-body-text">{profile.bio}</p>
    </section>
  )
}
