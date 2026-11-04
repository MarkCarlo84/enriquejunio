import React, { useCallback, useRef } from 'react'
import type { BusinessCardConfig } from '../types/businessCard'
import { ProfileHeader } from './ProfileHeader'
import { CardActions } from './CardActions'
import { EducationSection } from './EducationSection'
import { AchievementsCarousel } from './AchievementsCarousel'
import { FamilySection } from './FamilySection'
import { ProjectsCarousel } from './ProjectsCarousel'
import { ContactDetails } from './ContactDetails'
import { SocialLinks } from './SocialLinks'
import { Footer } from './Footer'
import { Reveal } from './Reveal'
import { Sun, Moon } from 'lucide-react'

interface BusinessCardProps {
  config: BusinessCardConfig
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  onToast: (message: string) => void
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  config,
  theme,
  onToggleTheme,
  onToast,
}) => {
  const cardRef = useRef<HTMLElement>(null)

  // Cursor-following light sheen (pointer devices only; no re-renders)
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    cardRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    cardRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }, [])

  const carouselItemCount = config.projects?.length ?? 0
  const projectCount = config.projectsCount ?? carouselItemCount
  let sectionIndex = 0
  const nextIndex = () => String(++sectionIndex).padStart(2, '0')

  return (
    <article
      ref={cardRef}
      className="business-card-root"
      onPointerMove={handlePointerMove}
    >
      {/* Metallic edge highlight + cursor sheen layers */}
      <div className="card-edge-light" aria-hidden="true" />
      <div className="card-cursor-sheen" aria-hidden="true" />

      {/* Discreet Theme Switcher */}
      <button
        type="button"
        id="theme-toggle"
        className="theme-toggle-btn"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <span className="theme-toggle-icon" key={theme}>
          {theme === 'dark' ? (
            <Sun size={15} strokeWidth={2} />
          ) : (
            <Moon size={15} strokeWidth={2} />
          )}
        </span>
      </button>

      {/* Full-Bleed Profile Header (Banner & Avatar) */}
      <ProfileHeader
        config={config}
        avatarSrc={config.profileImage}
        projectCount={projectCount}
      />

      {/* Card Content Body with Consistent Padding */}
      <div className="card-content-body">
        {/* Primary Action Buttons (Save Contact & Share) */}
        <Reveal delay={80}>
          <CardActions config={config} onToast={onToast} />
        </Reveal>

        {/* 1. Experiences Carousel */}
        {config.achievements && config.achievements.length > 0 && (
          <Reveal>
            <AchievementsCarousel
              achievements={config.achievements}
              index={nextIndex()}
            />
          </Reveal>
        )}

        {/* 2. Family Section */}
        {config.family && config.family.length > 0 && (
          <Reveal>
            <FamilySection family={config.family} index={nextIndex()} />
          </Reveal>
        )}

        {/* 3. Educational Background Section */}
        {config.education && config.education.length > 0 && (
          <Reveal>
            <EducationSection
              education={config.education}
              index={nextIndex()}
            />
          </Reveal>
        )}

        {/* 4. National Certificates Showcase Carousel */}
        {carouselItemCount > 0 && (
          <Reveal>
            <ProjectsCarousel projects={config.projects} index={nextIndex()} />
          </Reveal>
        )}

        {/* 5. Contact Details (Get in Touch) */}
        <Reveal>
          <ContactDetails config={config} index={nextIndex()} onToast={onToast} />
        </Reveal>

        {/* 6. Social Media & Developer Links (Find me Online) */}
        <Reveal>
          <SocialLinks config={config} index={nextIndex()} />
        </Reveal>

        {/* Minimal Footer */}
        <Footer config={config} />
      </div>
    </article>
  )
}
