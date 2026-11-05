import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Heart,
  User,
  Sparkles,
  Users,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
} from 'lucide-react'
import type { FamilyMember, FamilyPhotoItem } from '../types/businessCard'
import { SectionHeader } from './SectionHeader'

interface FamilySectionProps {
  family: FamilyMember[]
  photos?: FamilyPhotoItem[]
  index: string
}

/** Auto next image slide duration (ms) */
const SLIDE_DURATION = 4500

export const FamilySection: React.FC<FamilySectionProps> = ({
  family,
  photos = [],
  index,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const totalPhotos = photos.length
  const activePhoto = photos[activePhotoIndex] || photos[0]

  const handlePrevPhoto = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation()
      setActivePhotoIndex((prev) => (prev === 0 ? totalPhotos - 1 : prev - 1))
    },
    [totalPhotos]
  )

  const handleNextPhoto = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation()
      setActivePhotoIndex((prev) => (prev === totalPhotos - 1 ? 0 : prev + 1))
    },
    [totalPhotos]
  )

  // Auto-advance timer (cycles through photos every SLIDE_DURATION ms)
  useEffect(() => {
    if (totalPhotos <= 1 || isPaused || isLightboxOpen) return

    const timer = setInterval(() => {
      setActivePhotoIndex((prev) => (prev + 1) % totalPhotos)
    }, SLIDE_DURATION)

    return () => clearInterval(timer)
  }, [totalPhotos, isPaused, isLightboxOpen])

  // Keyboard navigation & lock body scroll for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false)
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto()
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLightboxOpen, handlePrevPhoto, handleNextPhoto])

  // Touch Swipe Handlers for mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current
      if (diff > 45) handleNextPhoto()
      else if (diff < -45) handlePrevPhoto()
    }
    touchStartX.current = null
    touchEndX.current = null
    setIsPaused(false)
  }

  if ((!family || family.length === 0) && (!photos || totalPhotos === 0)) {
    return null
  }

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
    <>
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

        {/* Featured Family Photo Showcase with Auto-Next Animation */}
        {totalPhotos > 0 && activePhoto && (
          <div
            className="family-showcase"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <div
              className="family-photo-card"
              onClick={() => setIsLightboxOpen(true)}
              role="button"
              tabIndex={0}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setIsLightboxOpen(true)
                }
              }}
              aria-label={`View full size: ${activePhoto.title}`}
            >
              <div className="family-photo-media">
                <img
                  key={activePhoto.src}
                  src={activePhoto.src}
                  alt={activePhoto.title}
                  className="family-photo-img"
                  loading="lazy"
                />
                <div className="family-photo-gradient" aria-hidden="true" />

                {/* Animated Story Progress Bars */}
                {totalPhotos > 1 && (
                  <div
                    className={`family-photo-progress-strip ${isPaused ? 'is-paused' : ''}`}
                    aria-hidden="true"
                  >
                    {photos.map((_, idx) => (
                      <div
                        key={idx}
                        className={`family-photo-progress-track ${
                          idx < activePhotoIndex
                            ? 'is-completed'
                            : idx === activePhotoIndex
                            ? 'is-active'
                            : ''
                        }`}
                      >
                        <span
                          key={
                            idx === activePhotoIndex
                              ? `fill-${activePhotoIndex}`
                              : `idle-${idx}`
                          }
                          className="family-photo-progress-fill"
                          style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Floating expand pill */}
                <button
                  type="button"
                  className="family-photo-zoom-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsLightboxOpen(true)
                  }}
                  aria-label="Expand photo to full screen"
                  title="View full screen"
                >
                  <Maximize2 size={13} strokeWidth={2.4} />
                  <span>Enlarge</span>
                </button>

                {/* Left / Right Quick Hover Arrows */}
                {totalPhotos > 1 && (
                  <div className="family-photo-arrows" aria-hidden="true">
                    <button
                      type="button"
                      className="family-photo-nav-arrow family-photo-nav-arrow--prev"
                      onClick={handlePrevPhoto}
                      aria-label="Previous family photo"
                      title="Previous photo"
                    >
                      <ChevronLeft size={16} strokeWidth={2.4} />
                    </button>
                    <button
                      type="button"
                      className="family-photo-nav-arrow family-photo-nav-arrow--next"
                      onClick={handleNextPhoto}
                      aria-label="Next family photo"
                      title="Next photo"
                    >
                      <ChevronRight size={16} strokeWidth={2.4} />
                    </button>
                  </div>
                )}

                {/* Caption Bar Overlay */}
                <div className="family-photo-caption-bar">
                  <div
                    key={activePhoto.src}
                    className="family-photo-caption-text"
                  >
                    <span className="family-photo-tag">
                      <Camera size={11} strokeWidth={2.2} />
                      <span>{activePhoto.subtitle || 'The Junio Family'}</span>
                    </span>
                    <h3 className="family-photo-headline">{activePhoto.title}</h3>
                  </div>

                  {totalPhotos > 1 && (
                    <span className="family-photo-counter">
                      {activePhotoIndex + 1} / {totalPhotos}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Family Member Cards Grid */}
        {family && family.length > 0 && (
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
                    <h4 className="family-member-name">{member.name}</h4>
                    {member.note && <p className="family-member-note">{member.note}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Full-Screen Lightbox Portal */}
      {isLightboxOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="experience-modal-overlay family-lightbox-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="family-lightbox-title"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div
              className="family-lightbox-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Header */}
              <div className="family-lightbox-header">
                <div className="family-lightbox-title-group">
                  <span className="experience-modal-tag">
                    Photo {activePhotoIndex + 1} of {totalPhotos}
                  </span>
                  <h3 id="family-lightbox-title" className="family-lightbox-title">
                    {activePhoto.title}
                  </h3>
                </div>
                <button
                  type="button"
                  className="experience-modal-close-btn"
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label="Close photo view"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>

              {/* Lightbox Image Container */}
              <div className="family-lightbox-stage">
                <img
                  key={`lightbox-${activePhoto.src}`}
                  src={activePhoto.src}
                  alt={activePhoto.title}
                  className="family-lightbox-img"
                />

                {totalPhotos > 1 && (
                  <>
                    <button
                      type="button"
                      className="family-lightbox-arrow family-lightbox-arrow--prev"
                      onClick={handlePrevPhoto}
                      aria-label="Previous photo"
                      title="Previous photo (Arrow Left)"
                    >
                      <ChevronLeft size={22} strokeWidth={2.4} />
                    </button>
                    <button
                      type="button"
                      className="family-lightbox-arrow family-lightbox-arrow--next"
                      onClick={handleNextPhoto}
                      aria-label="Next photo"
                      title="Next photo (Arrow Right)"
                    >
                      <ChevronRight size={22} strokeWidth={2.4} />
                    </button>
                  </>
                )}
              </div>

              {/* Lightbox Footer */}
              <div className="family-lightbox-footer">
                <span className="family-lightbox-subtitle">
                  {activePhoto.subtitle || 'The Junio Family'}
                </span>
                <button
                  type="button"
                  className="experience-modal-done-btn"
                  onClick={() => setIsLightboxOpen(false)}
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
