import type { BusinessCardConfig } from '../types/businessCard'

/**
 * Escapes special characters for RFC 2426 vCard compatibility
 */
function escapeVCardValue(value: string): string {
  if (!value) return ''
  return value
    .trim()
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/**
 * Splits a full name into First Name and Last Name components
 */
function parseName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' }
  }
  const firstName = parts[0]
  const lastName = parts.slice(1).join(' ')
  return { firstName, lastName }
}

/**
 * Builds an RFC 2426 compliant vCard 3.0 text string
 * Omits any missing or empty fields
 */
export function generateVCardString(config: BusinessCardConfig): string {
  // Prefer the real name for the address book entry; keep the brand as a nickname
  const contactName = config.displayName?.trim() || config.fullName
  const { firstName, lastName } = parseName(contactName)
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`,
    `FN:${escapeVCardValue(contactName)}`,
  ]

  if (contactName !== config.fullName && config.fullName?.trim()) {
    lines.push(`NICKNAME:${escapeVCardValue(config.fullName)}`)
  }

  if (config.businessName?.trim()) {
    lines.push(`ORG:${escapeVCardValue(config.businessName)}`)
  }

  if (config.professionalTitle?.trim()) {
    lines.push(`TITLE:${escapeVCardValue(config.professionalTitle)}`)
  }

  const phone = (config.phoneRaw || config.phoneNumber)?.trim()
  if (phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${phone}`)
  }

  if (config.emailAddress?.trim()) {
    lines.push(`EMAIL;TYPE=PREF,INTERNET:${config.emailAddress.trim()}`)
  }

  if (config.websiteUrl?.trim()) {
    lines.push(`URL:${config.websiteUrl.trim()}`)
  }

  if (config.businessAddress?.trim()) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCardValue(config.businessAddress)};;;;`)
  }

  if (config.shortDescription?.trim()) {
    lines.push(`NOTE:${escapeVCardValue(config.shortDescription)}`)
  }

  // Revision timestamp
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  lines.push(`REV:${now}`)
  lines.push('END:VCARD')

  return lines.join('\r\n') + '\r\n'
}

/**
 * Triggers a browser file download of the generated .vcf contact card
 */
export function downloadVCard(config: BusinessCardConfig): void {
  const vCardContent = generateVCardString(config)
  const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const sanitizedName = (config.displayName?.trim() || config.fullName)
    .trim()
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .replace(/\s+/g, '_')
  const fileName = `${sanitizedName || 'Contact'}.vcf`

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  link.setAttribute('style', 'display:none')
  document.body.appendChild(link)
  link.click()

  // Clean up resource
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 300)
}
