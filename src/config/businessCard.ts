import type { BusinessCardConfig } from '../types/businessCard'

/**
 * =========================================================================
 * NFC DIGITAL BUSINESS CARD — OWNER CONFIGURATION
 * =========================================================================
 * Single source of truth for the digital business card.
 * =========================================================================
 */
export const businessCardConfig: BusinessCardConfig = {
  // A. Profile Header & Brand Identity
  fullName: 'Lorem Ipsum',
  displayName: 'Enrique  S.  Junio',
  professionalTitle: 'STI Santa Rosa Instructor',
  businessName: 'Lorem Ipsum',
  shortDescription:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  availability: 'Lorem ipsum dolor',

  // Profile Picture & Signature Calligraphy Logo
  profileImage: '/images/sirjunio-profile.jpg',
  logoImage: '/images/sirjunio-logo.png',
  logoImageWhite: '/images/sirjunio-logo-white.png',

  // B. Contact Information
  phoneNumber: '+1 234 567 8900',
  phoneRaw: '+12345678900',
  emailAddress: 'lorem.ipsum@example.com',
  businessAddress: 'Lorem Ipsum, Dolor Sit Amet',

  // C. Social & Developer Links
  facebookUrl: 'https://www.facebook.com/loremipsum',
  instagramUrl: 'https://www.instagram.com/loremipsum',

  // Website / Portfolio
  websiteUrl: 'https://example.com',

  // Project count badge
  projectsCount: '99+',

  // D. Profile & Technical Competencies
  profileInfo: {
    degree: 'Lorem Ipsum Dolor Sit Amet',
    specialization: 'Consectetur Adipiscing Elit',
    highlights: [
      'Lorem ipsum dolor sit amet',
      'Consectetur adipiscing elit',
      'Sed do eiusmod tempor incididunt',
      'Labore et dolore magna aliqua',
    ],
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },

  // E. Dedicated Projects Carousel Showcase (Images removed)
  projects: [
    {
      id: 'project-1',
      title: 'Electronics Product Assembly and Servicing',
      category: 'National Certificate ||',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      tags: ['Lorem', 'Ipsum', 'Dolor', 'Sit'],
      linkUrl: 'https://example.com',
      githubUrl: 'https://example.com',
    },
    {
      id: 'project-2',
      title: 'Mechatronics',
      category: 'National Certificate ||',
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.',
      tags: ['Tempor', 'Incididunt', 'Labore'],
      linkUrl: 'https://example.com',
      githubUrl: 'https://example.com',
    },
    {
      id: 'project-3',
      title: 'Computer System Servicing',
      category: 'National Certificate ||',
      description:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
      tags: ['Magna', 'Aliqua', 'Minim'],
      linkUrl: 'https://example.com',
      githubUrl: 'https://example.com',
    },
  ],

  // Visuals & Themes
  themePreference: 'dark',
  accentColor: '#181920',
  accentHover: '#2a2c38',
}
