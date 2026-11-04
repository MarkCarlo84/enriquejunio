import React, { useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import type { ProjectItem } from '../types/businessCard'
import { SectionHeader } from './SectionHeader'

interface ProjectsCarouselProps {
  projects?: ProjectItem[]
  index: string
}

/** Autoplay duration per slide (ms) — kept in sync with the CSS progress fill */
const SLIDE_DURATION = 5000

export const ProjectsCarousel: React.FC<ProjectsCarouselProps> = ({ projects, index }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const items = projects || []
  const total = items.length

  const handleNext = useCallback(() => {
    if (total <= 1) return
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  const handlePrev = useCallback(() => {
    if (total <= 1) return
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current
      if (distance > 45) handleNext()
      else if (distance < -45) handlePrev()
    }
    touchStartX.current = null
    touchEndX.current = null
    setIsPaused(false)
  }

  if (total === 0) return null

  const activeProject = items[currentIndex]
  const primaryLink = activeProject.linkUrl || activeProject.githubUrl

  return (
    <section
      className="panel projects-panel certificates-panel"
      aria-roledescription="carousel"
      aria-labelledby="certificates-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <SectionHeader
        index={index}
        title="National"
        accent="Certificates"
        id="certificates-heading"
        meta={
          <span className="meta-counter" aria-live="polite">
            <strong>{String(currentIndex + 1).padStart(2, '0')}</strong>
            <span className="meta-counter-sep">/</span>
            {String(total).padStart(2, '0')}
          </span>
        }
      />

      {/* Story-style autoplay progress (each fill completing advances the slide) */}
      {total > 1 && (
        <div
          className={`story-progress ${isPaused ? 'is-paused' : ''}`}
          role="tablist"
          aria-label="National Certificate slides"
        >
          {items.map((project, idx) => (
            <button
              key={project.id}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Go to certificate ${idx + 1}: ${project.title}`}
              className={`story-segment ${idx < currentIndex ? 'is-complete' : ''} ${
                idx === currentIndex ? 'is-active' : ''
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              <span
                key={idx === currentIndex ? `active-${currentIndex}` : `idle-${idx}`}
                className="story-segment-fill"
                style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                onAnimationEnd={idx === currentIndex ? handleNext : undefined}
              />
            </button>
          ))}
        </div>
      )}

      <div
        className="carousel-stage"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <article className="project-card" key={activeProject.id}>
          {/* Project Preview Image (rendered only when an image exists) */}
          {activeProject.image ? (
            <div className={`project-media ${activeProject.id === 'nfc-business-card' ? 'project-media--no-scrim' : ''}`}>
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="project-image"
                loading="lazy"
                decoding="async"
              />
              {activeProject.id !== 'nfc-business-card' && (
                <div className="project-media-scrim" aria-hidden="true" />
              )}
              <span className="project-category">{activeProject.category}</span>

              {/* Prev / Next controls float on the image */}
              {total > 1 && (
                <div className="carousel-arrows">
                  <button
                    type="button"
                    id="project-prev-btn"
                    className="carousel-arrow"
                    onClick={handlePrev}
                    aria-label="Previous project"
                  >
                    <ChevronLeft size={17} strokeWidth={2.2} />
                  </button>
                  <button
                    type="button"
                    id="project-next-btn"
                    className="carousel-arrow"
                    onClick={handleNext}
                    aria-label="Next project"
                  >
                    <ChevronRight size={17} strokeWidth={2.2} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="project-card-header">
              <span className="project-category-badge">{activeProject.category}</span>
              {total > 1 && (
                <div className="carousel-arrows-inline">
                  <button
                    type="button"
                    id="cert-prev-btn"
                    className="carousel-arrow"
                    onClick={handlePrev}
                    aria-label="Previous certificate"
                  >
                    <ChevronLeft size={17} strokeWidth={2.2} />
                  </button>
                  <button
                    type="button"
                    id="cert-next-btn"
                    className="carousel-arrow"
                    onClick={handleNext}
                    aria-label="Next certificate"
                  >
                    <ChevronRight size={17} strokeWidth={2.2} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Certificate Content */}
          <div className="project-content">
            <h3 className="project-title">{activeProject.title}</h3>
            <p className="project-description">{activeProject.description}</p>

            {activeProject.tags && activeProject.tags.length > 0 && (
              <ul className="project-tags" aria-label="Core competencies and skills">
                {activeProject.tags.map((tag) => (
                  <li key={tag} className="project-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            {primaryLink && (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
                aria-label={`View ${activeProject.title} certificate`}
              >
                <span>View certificate</span>
                <ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" />
              </a>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
