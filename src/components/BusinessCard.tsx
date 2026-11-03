import React, { useCallback, useRef } from 'react'
import type { BusinessCardConfig } from '../types/businessCard'
import { ProfileHeader } from './ProfileHeader'
import { CardActions } from './CardActions'
import { GraduateProfileSection } from './GraduateProfileSection'
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

        {/* IT Graduate Profile & Competencies Section */}
        {config.profileInfo && (
          <Reveal>
            <GraduateProfileSection
              config={config}
              index={nextIndex()}
            />
          </Reveal>
        )}

        {/* Projects Showcase Carousel */}
        {carouselItemCount > 0 && (
          <Reveal>
            <ProjectsCarousel projects={config.projects} index={nextIndex()} />
          </Reveal>
        )}

        {/* Contact Details (Phone, Email, Location) */}
        <Reveal>
          <ContactDetails config={config} index={nextIndex()} onToast={onToast} />
        </Reveal>

        {/* Social Media & Developer Links */}
        <Reveal>
          <SocialLinks config={config} index={nextIndex()} />
        </Reveal>

        {/* Minimal Footer */}
        <Footer config={config} />
      </div>
    </article>
  )
}
