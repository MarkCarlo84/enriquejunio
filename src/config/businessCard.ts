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
  phoneNumber: '0945 145 6984',
  phoneRaw: '09451456984',
  emailAddress: 'enritech@yahoo.com',
  businessAddress: '',

  // C. Social & Online Links
  facebookUrl: 'https://www.facebook.com/ricky.junio',
  facebookHandle: 'Ricky Junio',
  gmailUrl: 'rickyjunio3163@gmail.com',

  // Website / Portfolio
  websiteUrl: 'https://example.com',

  // National Certificates count badge
  projectsCount: '03',

  // 1. Experiences (Academic & Non-Academic)
  achievements: [
    // A. ACADEMIC EXPERIENCE
    {
      title: 'Retired College Professor',
      category: 'A. ACADEMIC EXPERIENCE',
      icon: 'graduation-cap',
    },
    {
      title: 'Former Commandant of HIA, MIT, and Assumption College',
      category: 'A. ACADEMIC EXPERIENCE',
      icon: 'shield',
    },
    {
      title: 'Former Instructor Physics, Mathematics, and Technology @Muntinlupa Institute of Technology',
      category: 'A. ACADEMIC EXPERIENCE',
      icon: 'atom',
    },
    {
      title: 'Former Department Head of Electronics and Telecommunication @Philippine Science and Technology Centers',
      category: 'A. ACADEMIC EXPERIENCE',
      icon: 'radio',
    },
    {
      title: 'Former Instructor Hardware Department @AMA College',
      category: 'A. ACADEMIC EXPERIENCE',
      icon: 'cpu',
    },
    {
      title: 'Former Technology Program Head @PUP Biñan',
      category: 'A. ACADEMIC EXPERIENCE',
      icon: 'layers',
    },
    {
      title: 'Instructor & Engineering Program Head @STI Santa Rosa',
      category: 'A. ACADEMIC EXPERIENCE',
      icon: 'cog',
    },

    // B. NON-ACADEMIC EXPERIENCE / AFFILIATIONS
    {
      title: 'Reservist – Armed Forces of the Philippines (AFP)',
      category: 'B. NON-ACADEMIC EXPERIENCE / AFFILIATIONS',
      icon: 'flag',
    },
    {
      title: 'TESDA Assessor – Instrumentation and Process Control',
      category: 'B. NON-ACADEMIC EXPERIENCE / AFFILIATIONS',
      icon: 'gauge',
    },
    {
      title: 'TESDA – Electrical Installation and Maintenance',
      category: 'B. NON-ACADEMIC EXPERIENCE / AFFILIATIONS',
      icon: 'zap',
    },
    {
      title: 'Member – Federation of Homeowners Associations of Barangay Santo Tomas',
      category: 'B. NON-ACADEMIC EXPERIENCE / AFFILIATIONS',
      icon: 'home',
    },
    {
      title: 'President @Welmanville Biñan Homeowners Association',
      category: 'B. NON-ACADEMIC EXPERIENCE / AFFILIATIONS',
      icon: 'crown',
    },
    {
      title: 'Vice President @EARIST ROTC Synchronous Association',
      category: 'B. NON-ACADEMIC EXPERIENCE / AFFILIATIONS',
      icon: 'medal',
    },
    {
      title: 'Facilities Supervisor (cum Technician) @Dubai, UAE',
      category: 'B. NON-ACADEMIC EXPERIENCE / AFFILIATIONS',
      icon: 'building',
    },
  ],

  // 2. Family (Wife, Son, Daughter)
  family: [
    {
      relation: 'Wife',
      name: "Eleanor Tabirao Junio",
      note: 'Spouse',
    },
    {
      relation: 'Son',
      name: "Engr. John Oswald Erickson T. Junio",
      note: 'Son',
    },
    {
      relation: 'Daughter',
      name: "Ar. Johana Ericka T. Junio",
      note: 'Daughter',
    },
  ],

  // 3. Educational Background (College Degree & Master's Degree)
  education: [
    {
      level: 'College Degree',
      degree: 'Bachelor of Science in Industrial Technology',
      institution: 'Eulogio Rodriguez Institute of Science and Technology (EARIST)',
      specialization: 'Major in Electronics',
      year: 'Graduated',
      description: 'Undergraduate degree program.',
    },
    {
      level: "Master's Degree",
      degree: 'Master of Arts Majoring Administration and Supervision',
      institution: 'Eulogio Rodriguez Institute of Science and Technology (EARIST)',
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
