import React from 'react'
import { GraduationCap, Award } from 'lucide-react'
import type { EducationItem } from '../types/businessCard'
import { SectionHeader } from './SectionHeader'

interface EducationSectionProps {
  education: EducationItem[]
  index: string
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education, index }) => {
  if (!education || education.length === 0) return null

  return (
    <section className="panel education-panel" aria-labelledby="education-heading">
      <SectionHeader
        index={index}
        title="Educational"
        accent="Background"
        id="education-heading"
        meta={
          <span className="meta-chip meta-chip-solid">
            {education.length === 1 ? '1 Degree' : `${education.length} Degrees`}
          </span>
        }
      />

      <div className="education-list">
        {education.map((item, idx) => {
          const isMasters =
            item.level?.toLowerCase().includes('master') ||
            item.degree?.toLowerCase().includes('master')

          return (
            <article key={item.id || idx} className="education-card">
              <div className="education-card-top">
                <div
                  className={`education-icon-box ${isMasters ? 'education-icon-box--masters' : ''}`}
                  aria-hidden="true"
                >
                  {isMasters ? (
                    <Award size={20} strokeWidth={1.8} />
                  ) : (
                    <GraduationCap size={20} strokeWidth={1.8} />
                  )}
                </div>

                <div className="education-text">
                  <div className="education-header-row">
                    {item.level && (
                      <span className="education-level-badge">{item.level}</span>
                    )}
                    {item.year && <span className="education-year">{item.year}</span>}
                  </div>

                  <h3 className="education-degree">{item.degree}</h3>

                  {item.institution && (
                    <p className="education-institution">{item.institution}</p>
                  )}

                  {item.specialization && (
                    <p className="education-specialization">{item.specialization}</p>
                  )}
                </div>
              </div>

              {item.description && (
                <p className="education-description">{item.description}</p>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

