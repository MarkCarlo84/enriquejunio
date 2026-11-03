import React from 'react'

interface SectionHeaderProps {
  /** Editorial index, e.g. "01" */
  index: string
  /** Plain lead word(s) */
  title: string
  /** Italic serif accent word(s) */
  accent?: string
  /** Optional right-aligned meta content (counter, badge, etc.) */
  meta?: React.ReactNode
  id?: string
}

/**
 * Consistent editorial section header used across every card panel:
 * mono index · title with serif-italic accent · optional meta.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ index, title, accent, meta, id }) => {
  return (
    <div className="section-header">
      <div className="section-header-left">
        <span className="section-index" aria-hidden="true">
          {index}
        </span>
        <h2 className="section-title" id={id}>
          {title}
          {accent && <em className="section-title-accent"> {accent}</em>}
        </h2>
      </div>
      {meta && <div className="section-header-meta">{meta}</div>}
    </div>
  )
}
