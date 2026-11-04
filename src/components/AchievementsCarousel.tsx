import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Trophy, Award, Medal, Star, Sparkles, X } from 'lucide-react'
import type { AchievementItem } from '../types/businessCard'
import { SectionHeader } from './SectionHeader'

interface AchievementsCarouselProps {
  achievements: AchievementItem[]
  index: string
}

export const AchievementsCarousel: React.FC<AchievementsCarouselProps> = ({
  achievements,
  index,
}) => {
  const items = achievements || []
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<AchievementItem | null>(null)

  const handleOpen = useCallback((item?: AchievementItem) => {
    setSelectedExperience(item || null)
    setIsModalOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsModalOpen(false)
    setSelectedExperience(null)
  }, [])

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isModalOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen, handleClose])

  if (items.length === 0) return null

  // Split into 2 rows for split-directional marquee banner
  const row1Base = items.filter((_, i) => i % 2 === 0)
  const row2Base = items.filter((_, i) => i % 2 !== 0)

  const safeRow1 = row1Base.length > 0 ? row1Base : items
  const safeRow2 = row2Base.length > 0 ? row2Base : items

  // Ensure each track has enough items for seamless infinite loop (at least 6 per half)
  const padItems = (arr: AchievementItem[], min: number) => {
    let res = [...arr]
    while (res.length < min) {
      res = [...res, ...arr]
    }
    return res
  }

  const track1Half = padItems(safeRow1, 6)
  const track2Half = padItems(safeRow2, 6)

  // Duplicate for seamless 0% to -50% CSS loop
  const fullTrack1 = [...track1Half, ...track1Half]
  const fullTrack2 = [...track2Half, ...track2Half]

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'medal':
        return <Medal size={13} strokeWidth={2.2} />
      case 'star':
        return <Star size={13} strokeWidth={2.2} />
      case 'sparkles':
        return <Sparkles size={13} strokeWidth={2.2} />
      case 'award':
        return <Award size={13} strokeWidth={2.2} />
      case 'trophy':
      default:
        return <Trophy size={13} strokeWidth={2.2} />
    }
  }

  return (
    <>
      <section className="achievements-banner-section" aria-label="Experiences">
        <SectionHeader
          index={index}
          title="Experiences"
          id="experiences-heading"
          meta={
            <span className="meta-chip meta-chip-solid">
              {items.length === 1 ? '1 Experience' : `${items.length} Experiences`}
            </span>
          }
        />

        {/* Split-Directional Banner Ticker (Clickable pills) */}
        <div
          className="achievements-marquee-wrapper"
          tabIndex={0}
          role="region"
          aria-label="Scrolling experience titles — click any item to view all"
        >
          {/* Track 1: Glides Left */}
          <div className="achievements-track achievements-track--left">
            {fullTrack1.map((item, idx) => (
              <button
                key={`r1-${idx}`}
                type="button"
                className="achievement-pill"
                onClick={() => handleOpen(item)}
                aria-label={`View experience: ${item.title}`}
              >
                <span className="achievement-pill-icon" aria-hidden="true">
                  {renderIcon(item.icon)}
                </span>
                <span className="achievement-pill-title">{item.title}</span>
              </button>
            ))}
          </div>

          {/* Track 2: Glides Right */}
          <div className="achievements-track achievements-track--right">
            {fullTrack2.map((item, idx) => (
              <button
                key={`r2-${idx}`}
                type="button"
                className="achievement-pill"
                onClick={() => handleOpen(item)}
                aria-label={`View experience: ${item.title}`}
              >
                <span className="achievement-pill-icon" aria-hidden="true">
                  {renderIcon(item.icon)}
                </span>
                <span className="achievement-pill-title">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Dialog Portal showing all experiences */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="experience-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="experience-modal-title"
          onClick={handleClose}
        >
          <div
            className="experience-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="experience-modal-header">
              <div className="experience-modal-title-group">
                <span className="experience-modal-tag">All Records</span>
                <h3 id="experience-modal-title" className="experience-modal-title">
                  Experiences
                </h3>
              </div>
              <button
                type="button"
                className="experience-modal-close-btn"
                onClick={handleClose}
                aria-label="Close experiences modal"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Modal List */}
            <div className="experience-modal-body">
              <div className="experience-modal-list">
                {items.map((item, idx) => {
                  const isSelected = selectedExperience?.title === item.title
                  return (
                    <div
                      key={item.id || idx}
                      className={`experience-modal-item ${isSelected ? 'experience-modal-item--selected' : ''}`}
                    >
                      <div className="experience-modal-item-left">
                        <span className="experience-modal-num">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="experience-modal-icon-box" aria-hidden="true">
                          {renderIcon(item.icon)}
                        </div>
                      </div>
                      <div className="experience-modal-item-text">
                        <h4 className="experience-modal-item-title">{item.title}</h4>
                        {item.description && (
                          <p className="experience-modal-item-desc">{item.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="experience-modal-footer">
              <span className="experience-modal-counter">
                Showing all {items.length} experiences
              </span>
              <button
                type="button"
                className="experience-modal-done-btn"
                onClick={handleClose}
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
