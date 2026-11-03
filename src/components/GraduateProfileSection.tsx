import React from 'react'
import type { BusinessCardConfig } from '../types/businessCard'
import { GraduationCap } from 'lucide-react'
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
  if (!profile) return null

  return (
    <section className="panel profile-panel" aria-labelledby="profile-heading">
      <SectionHeader
        index={index}
        title="Profile"
        accent="Overview"
        id="profile-heading"
        meta={<span className="meta-chip meta-chip-solid">LOREM</span>}
      />

      {/* Academic Degree */}
      <div className="degree-row">
        <div className="degree-icon-box" aria-hidden="true">
          <GraduationCap size={20} strokeWidth={1.8} />
        </div>
        <div className="degree-text">
          <h3 className="degree-name">{profile.degree}</h3>
          <p className="degree-specialization">{profile.specialization}</p>
        </div>
      </div>

      {/* Professional Bio */}
      <p className="panel-body-text">{profile.bio}</p>

      {/* Core Competencies */}
      <div className="competencies-block">
        <span className="micro-label">Competencies</span>
        <ul className="competencies-grid">
          {profile.highlights.map((item, i) => (
            <li key={item} className="competency-tile">
              <span className="competency-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="competency-text">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
