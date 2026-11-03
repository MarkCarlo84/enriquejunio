import React from 'react'
import type { BusinessCardConfig } from '../types/businessCard'

interface FooterProps {
  config: BusinessCardConfig
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  const year = new Date().getFullYear()
  const entityName = config.businessName || config.fullName

  return (
    <footer className="card-footer">
      <div className="footer-divider" aria-hidden="true">
        <span className="nfc-beacon">
          <span className="nfc-beacon-ring" />
          <span className="nfc-beacon-ring nfc-beacon-ring-delay" />
          <span className="nfc-beacon-core" />
        </span>
      </div>

      <p className="copyright-text">
        &copy; {year} {entityName}. All rights reserved.
      </p>
    </footer>
  )
}
