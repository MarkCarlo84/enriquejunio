/**
 * Business Card Data Model & Types
 * Defines all configurable properties for the NFC Digital Business Card.
 */

export interface ProjectItem {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  image?: string
  linkUrl?: string
  githubUrl?: string
}

export interface GraduateProfileInfo {
  degree: string
  specialization: string
  highlights: string[]
  bio: string
}

export interface BusinessCardConfig {
  /** Full Name of the professional or business owner */
  fullName: string

  /** Display Name / Brand Handle */
  displayName?: string

  /** Professional title, designation, or occupation */
  professionalTitle: string

  /** Name of the business, studio, or enterprise */
  businessName: string

  /** Short professional introduction */
  shortDescription?: string

  /** Optional availability status shown as a pill (e.g. "Open to opportunities") */
  availability?: string

  /** Local asset path or URL for the profile picture */
  profileImage?: string

  /** Local asset path or URL for the business/signature logo */
  logoImage?: string

  /** Local asset path or URL for the white business/signature logo (dark mode) */
  logoImageWhite?: string

  /** Optional background image or custom style for the header banner */
  headerBannerImage?: string

  /** Formatted phone number displayed to visitors */
  phoneNumber?: string

  /** Clean numeric phone number used for tel: links & vCard */
  phoneRaw?: string

  /** Professional email address used for mailto: links & vCard */
  emailAddress?: string

  /** Business location or street address */
  businessAddress?: string

  /** Facebook profile or page URL */
  facebookUrl?: string

  /** Instagram profile URL */
  instagramUrl?: string

  /** GitHub profile or repository URL */
  githubUrl?: string

  /** Optional website or portfolio URL */
  websiteUrl?: string

  /** Dedicated IT Graduate Profile & Competency Information */
  profileInfo?: GraduateProfileInfo

  /** Total project count display (e.g. "20+") */
  projectsCount?: string | number

  /** Dedicated IT & software projects showcased in the interactive carousel */
  projects?: ProjectItem[]

  /** Theme preference: 'dark', 'light', or 'system' */
  themePreference?: 'dark' | 'light' | 'system'

  /** Hex color for custom accent highlights */
  accentColor?: string

  /** Hex color for button hover states */
  accentHover?: string
}
