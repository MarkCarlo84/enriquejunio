import React from 'react'
import { Heart, User, Sparkles, Users } from 'lucide-react'
import type { FamilyMember } from '../types/businessCard'
import { SectionHeader } from './SectionHeader'

interface FamilySectionProps {
  family: FamilyMember[]
  index: string
}

export const FamilySection: React.FC<FamilySectionProps> = ({ family, index }) => {
  if (!family || family.length === 0) return null

  const getRelationIcon = (relation: string) => {
    const rel = relation.toLowerCase().trim()
    if (rel.includes('wife') || rel.includes('spouse') || rel.includes('partner')) {
      return <Heart size={18} strokeWidth={2.1} fill="currentColor" />
    }
    if (rel.includes('daughter')) {
      return <Sparkles size={18} strokeWidth={2} />
    }
    if (rel.includes('son') || rel.includes('child')) {
      return <User size={18} strokeWidth={2} />
    }
    return <Users size={18} strokeWidth={2} />
  }

  return (
    <section className="panel family-panel" aria-labelledby="family-heading">
      <SectionHeader
        index={index}
        title="Family"
        id="family-heading"
        meta={
          <span className="meta-chip meta-chip-solid">
            <Heart size={11} fill="currentColor" style={{ marginRight: '5px' }} />
            Family
          </span>
        }
      />

      <div className="family-grid">
        {family.map((member, idx) => {
          // First card (e.g. Wife) spans full width when count is odd, following cards share row (e.g. Son & Daughter)
          const isFullWidth = idx === 0 && family.length % 2 !== 0

          return (
            <div
              key={member.id || idx}
              className={`family-card ${isFullWidth ? 'family-card--full' : 'family-card--compact'}`}
            >
              <div className="family-card-header">
                <div
                  className={`family-icon-box family-icon-box--${member.relation.toLowerCase().replace(/[^a-z]/g, '')}`}
                  aria-hidden="true"
                >
                  {getRelationIcon(member.relation)}
                </div>
                <span className="family-relation-badge">{member.relation}</span>
              </div>

              <div className="family-text">
                <h3 className="family-member-name">{member.name}</h3>
                {member.note && <p className="family-member-note">{member.note}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

