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
  fullName: 'Sir Junio',
  displayName: 'Enrique  S.  Junio',
  professionalTitle: 'STI Santa Rosa Instructor',
  businessName: 'Sir Junio',
  shortDescription:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  availability: 'Lorem ipsum dolor',

  // Profile Picture (Banner removed)
  profileImage: '/images/sirjunio-profile.jpg',
  showBanner: false,

  // B. Contact Information
  phoneNumber: '+1 234 567 8900',
  phoneRaw: '+12345678900',
  emailAddress: 'lorem.ipsum@example.com',
  businessAddress: 'Lorem Ipsum, Dolor Sit Amet',

  // C. Social & Online Links
  facebookUrl: 'https://www.facebook.com/loremipsum',
  gmailUrl: 'lorem.ipsum@gmail.com',

  // Website / Portfolio
  websiteUrl: 'https://example.com',

  // National Certificates count badge
  projectsCount: '03',

  // 1. Experiences Banner (15 titles)
  achievements: [
    { title: 'Lorem Ipsum Dolor Sit', icon: 'trophy' },
    { title: 'Lorem Ipsum Consectetur', icon: 'medal' },
    { title: 'Lorem Ipsum Adipiscing', icon: 'award' },
    { title: 'Lorem Ipsum Eiusmod', icon: 'star' },
    { title: 'Lorem Ipsum Tempor', icon: 'sparkles' },
    { title: 'Lorem Ipsum Incididunt', icon: 'trophy' },
    { title: 'Lorem Ipsum Labore', icon: 'medal' },
    { title: 'Lorem Ipsum Dolore', icon: 'award' },
    { title: 'Lorem Ipsum Magna', icon: 'star' },
    { title: 'Lorem Ipsum Aliqua', icon: 'sparkles' },
    { title: 'Lorem Ipsum Minim', icon: 'trophy' },
    { title: 'Lorem Ipsum Veniam', icon: 'medal' },
    { title: 'Lorem Ipsum Nostrud', icon: 'award' },
    { title: 'Lorem Ipsum Ullamco', icon: 'star' },
    { title: 'Lorem Ipsum Laboris', icon: 'sparkles' },
  ],

  // 2. Family (Wife, Son, Daughter)
  family: [
    {
      relation: 'Wife',
      name: "Wife's Name",
      note: 'Spouse',
    },
    {
      relation: 'Son',
      name: "Son's Name",
      note: 'Son',
    },
    {
      relation: 'Daughter',
      name: "Daughter's Name",
      note: 'Daughter',
    },
  ],

  // 3. Educational Background (College Degree & Master's Degree)
  education: [
    {
      level: 'College Degree',
      degree: 'Bachelor of Science in ...',
      institution: 'College / University Name',
      specialization: 'Major in ...',
      year: 'Graduated',
      description: 'Undergraduate degree program.',
    },
    {
      level: "Master's Degree",
      degree: 'Master of Arts in ...',
      institution: 'Graduate School / University Name',
      specialization: 'Major in ...',
      year: 'Completed',
      description: 'Postgraduate degree program.',
    },
  ],

  // 4. National Certificates (TESDA NC II Credentials)
  projects: [
    {
      id: 'nc2-epas',
      title: 'Electronics Product Assembly and Servicing NC II',
      category: 'TESDA National Certificate II',
      description:
        'Certified competency in assembling, installing, calibrating, testing, and troubleshooting electronic components, circuits, and consumer electronic systems.',
      tags: ['PCB Assembly', 'Circuit Testing', 'Soldering', 'Electronics Repair'],
      linkUrl: '',
      githubUrl: '',
    },
    {
      id: 'nc2-mechatronics',
      title: 'Mechatronics Servicing NC II',
      category: 'TESDA National Certificate II',
      description:
        'Certified competency in installing, configuring, testing, and maintaining mechatronics systems, electropneumatics, sensors, and programmable logic controllers (PLCs).',
      tags: ['PLC Systems', 'Pneumatics', 'Industrial Automation', 'Sensors & Actuators'],
      linkUrl: '',
      githubUrl: '',
    },
    {
      id: 'nc2-css',
      title: 'Computer System Servicing NC II',
      category: 'TESDA National Certificate II',
      description:
        'Certified competency in assembling computer systems and networks, configuring routers and switches, installing operating systems, and server deployment.',
      tags: ['Hardware Assembly', 'LAN Networking', 'OS Installation', 'Server Setup'],
      linkUrl: '',
      githubUrl: '',
    },
  ],

  // Visuals & Themes
  themePreference: 'dark',
  accentColor: '#181920',
  accentHover: '#2a2c38',
}
