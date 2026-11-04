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

export interface EducationItem {
  id?: string
  /** Level or category, e.g. "College Degree" | "Master's Degree" */
  level?: string
  /** Official degree title, e.g. "Bachelor of Science in ..." or "Master of Arts in ..." */
  degree: string
  /** College, university, or academic institution */
  institution?: string
  /** Major, specialization, or concentration */
  specialization?: string
  /** Graduation year or inclusive years, e.g. "2018 - 2022" or "Graduated" */
  year?: string
  /** Optional academic highlights, honors, or thesis title */
  description?: string
}

export interface AchievementItem {
  id?: string
  /** Title of the award, honor, or milestone */
  title: string
  /** Category or award tier, e.g. "Faculty Recognition", "National Certification", "Award" */
  category?: string
  /** Issuing organization or institution, e.g. "STI College Santa Rosa" */
  issuer?: string
  /** Year, date, or period awarded, e.g. "2024" or "2022 - 2023" */
  year?: string
  /** Detailed description or impact of the achievement */
  description?: string
  /** Icon symbol: 'graduation-cap' | 'shield' | 'atom' | 'radio' | 'cpu' | 'layers' | 'cog' | 'flag' | 'gauge' | 'zap' | 'home' | 'crown' | 'medal' | 'building' | 'trophy' | 'award' | 'star' | 'sparkles' | string */
  icon?: string
}

export interface FamilyMember {
  id?: string
  /** Relationship to the owner, e.g. "Wife" | "Son" | "Daughter" */
  relation: string
  /** Full name of the family member */
  name: string
  /** Optional personal note, dedication, or detail */
  note?: string
}

export interface GraduateProfileInfo {
  degree: string
  specialization: string
  highlights?: string[]
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

  /** Facebook display name or account handle */
  facebookHandle?: string

  /** Gmail / Google Mail address or direct compose URL */
  gmailUrl?: string

  /** Instagram profile URL (fallback) */
  instagramUrl?: string

  /** GitHub profile or repository URL */
  githubUrl?: string

  /** Optional website or portfolio URL */
  websiteUrl?: string

  /** Dedicated educational background milestones (College Degree, Master's Degree, etc.) */
  education?: EducationItem[]

  /** Dedicated honors, key achievements, recognitions, and milestones */
  achievements?: AchievementItem[]

  /** Dedicated IT Graduate Profile & Competency Information */
  profileInfo?: GraduateProfileInfo

  /** Immediate family members (Wife, Son, Daughter, etc.) */
  family?: FamilyMember[]

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

  /** Whether to show the top decorative banner (default: false) */
  showBanner?: boolean
}
