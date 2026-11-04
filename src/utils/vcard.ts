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
    lines.push(`TEL;TYPE=CELL,VOICE,PREF:${phone}`)
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

/**
 * Automatically detects the device environment and opens the contact directly:
 * - On Android: Directly triggers the native Android Contacts Application insert intent with phone number & details pre-filled.
 * - On iOS (iPhone): Opens the native iOS Contact card preview to add directly to address book.
 * - On Desktop / Other: Downloads the standard .vcf file.
 */
export function saveContactToPhone(config: BusinessCardConfig): {
  success: boolean
  method: 'android_intent' | 'ios_vcard' | 'vcard_download'
} {
  if (typeof window === 'undefined') {
    return { success: false, method: 'vcard_download' }
  }

  const userAgent = navigator.userAgent || ''
  const isAndroid = /android/i.test(userAgent)
  const isIOS = /iphone|ipad|ipod/i.test(userAgent)

  const rawPhone = (config.phoneRaw || config.phoneNumber || '').trim()
  const phone = rawPhone.replace(/\s+/g, '')
  const contactName = (config.displayName?.trim() || config.fullName || 'Sir Junio')
    .replace(/\s+/g, ' ')
    .trim()
  const email = (config.emailAddress || '').trim()
  const company = (config.businessName || 'STI Santa Rosa').trim()
  const title = (config.professionalTitle || '').trim()

  // 1. Android: Native Contacts Application Intent with Sir Junio's Number
  if (isAndroid && phone) {
    try {
      const intentUrl = `intent:#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.dir/contact;S.name=${encodeURIComponent(
        contactName
      )};S.phone=${encodeURIComponent(phone)};S.email=${encodeURIComponent(
        email
      )};S.company=${encodeURIComponent(company)};S.job_title=${encodeURIComponent(
        title
      )};end`
      window.location.href = intentUrl
      return { success: true, method: 'android_intent' }
    } catch {
      downloadVCard(config)
      return { success: true, method: 'vcard_download' }
    }
  }

  // 2. iOS (iPhone/iPad): Direct vCard navigation opens the native "Create Contact" card
  if (isIOS) {
    try {
      const vCardContent = generateVCardString(config)
      const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      window.location.href = url
      setTimeout(() => URL.revokeObjectURL(url), 4000)
      return { success: true, method: 'ios_vcard' }
    } catch {
      downloadVCard(config)
      return { success: true, method: 'vcard_download' }
    }
  }

  // 3. Desktop / Fallback: Standard .vcf download
  downloadVCard(config)
  return { success: true, method: 'vcard_download' }
}
