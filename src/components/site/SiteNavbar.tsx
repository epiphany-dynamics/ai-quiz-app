import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import '@/styles/site-nav.css'

const SITE = 'https://epiphanydynamics.ai'
const BOOK = 'https://book.epiphanydynamics.ai'

const navLinks = [
  { name: 'About', href: `${SITE}/about` },
  { name: 'Services', href: `${SITE}/services` },
  { name: 'By City', href: `${SITE}/locations` },
  { name: 'By Industry', href: `${SITE}/industries` },
  { name: 'Pricing', href: `${SITE}/pricing` },
  { name: 'Blog', href: `${SITE}/blog` },
]

const secondaryLinks = [
  { name: 'By City', href: `${SITE}/locations` },
  { name: 'By Industry', href: `${SITE}/industries` },
  { name: 'Newsletter', href: `${SITE}/newsletter` },
  { name: 'Pricing', href: `${SITE}/pricing` },
  { name: 'Our Work', href: `${SITE}/portfolio` },
  { name: 'Case Studies', href: `${SITE}/case-studies/jason-fransos` },
  { name: 'AI Quiz', href: 'https://quiz.epiphanydynamics.ai', external: true },
  { name: 'AI Calculator', href: 'https://ai4bizcalculator.online', external: true },
  { name: 'Book your free audit', href: BOOK },
  { name: 'Learn', href: 'https://epiphany.help', external: true },
]

const socialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/epiphany-dynamics' },
  { name: 'Instagram', href: 'https://www.instagram.com/epiphanydynamics' },
]

/**
 * Hamburger icon with CSS morph to X.
 * Bar color follows the active theme's primary ink token (flips with data-theme).
 */
const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="w-5 h-3.5 relative flex flex-col justify-between">
    <span
      className="block w-full h-[2px] rounded-full bg-ink origin-center transition-transform duration-300"
      style={{
        transform: isOpen ? 'translateY(5px) rotate(45deg)' : 'none',
        transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
      }}
    />
    <span
      className="block w-full h-[2px] rounded-full bg-ink origin-center transition-transform duration-300"
      style={{
        transform: isOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
        transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
      }}
    />
  </div>
)

export function SiteNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  // Overlay layers — staggered cascade (Joby-style theatrical reveal).
  // Colors come from CSS vars so the wipe matches the active theme.
  const overlayLayers = [
    { color: 'var(--color-bg)', height: '100%', delay: 0 },
    { color: 'var(--color-bg-elev)', height: '100%', delay: 0.08 },
    { color: 'var(--color-surface)', height: '85%', delay: 0.16 },
    { color: 'var(--color-brand-cream)', height: '50%', delay: 0.24 },
  ]

  return (
    <>
      <header className="ed-site-header">
        <a className="ed-site-header__brand" href={SITE} aria-label="Epiphany Dynamics home">
          <img
            src="/images/logos/new_geometric_mark.png"
            alt=""
            width={122}
            height={189}
          />
          <span className="ed-site-header__wordmark">Epiphany Dynamics</span>
        </a>
        <nav className="ed-site-header__nav" aria-label="Primary navigation">
          <div className="ed-site-header__theme">
            <ThemeToggle />
          </div>
          <a className="ed-site-header__book hidden sm:inline-flex" href={BOOK}>
            Book your free audit
          </a>
          <a
            href="https://quiz.epiphanydynamics.ai"
            className="site-btn-secondary nav-cta ed-site-header__cta"
          >
            <span className="btn-in">
              <span className="ed-site-header__cta-full">Get started</span>
              <span className="ed-site-header__cta-short">Start</span>
            </span>
            <span className="btn-out" aria-hidden="true">
              <span className="ed-site-header__cta-full">Get started</span>
              <span className="ed-site-header__cta-short">Start</span>
            </span>
          </a>
          <button
            type="button"
            className="ed-site-header__menu"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <HamburgerIcon isOpen={isMenuOpen} />
            <span className="hidden md:inline text-xs font-geist tracking-[0.15em] uppercase">
              Menu
            </span>
          </button>
        </nav>
      </header>

      {/* Full-screen menu overlay — follows the active theme (paper + ink
          in light mode), matching the canonical main-site overlay. */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {overlayLayers.map((layer, i) => (
              <motion.div
                key={`layer-${i}`}
                className="fixed inset-0 z-[101] pointer-events-none"
                style={{ backgroundColor: layer.color, height: layer.height }}
                initial={{ y: '-100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.6, delay: layer.delay, ease: [0.65, 0, 0.35, 1] }}
              />
            ))}

            <motion.div
              className="fixed inset-0 z-[102] flex flex-col bg-bg"
              data-magnetic-exclude
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {/* Menu top bar */}
              <div className="flex items-center justify-between px-6 md:px-10 h-[68px] md:h-[76px]">
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-ink hover:opacity-70 transition-opacity duration-200 min-h-[44px] min-w-[44px]"
                >
                  <HamburgerIcon isOpen={true} />
                  <span className="hidden md:inline text-xs font-geist tracking-[0.15em] uppercase">
                    Close
                  </span>
                </button>

                <a
                  href={SITE}
                  className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2.5"
                >
                  <img
                    src="/images/logos/new_geometric_mark.png"
                    alt="Epiphany Dynamics"
                    className="nav-logo-mark w-8 h-8 md:w-9 md:h-9"
                  />
                  <div className="flex flex-col">
                    <span className="font-geist font-bold tracking-tight leading-none text-ink text-sm md:text-base">EPIPHANY</span>
                    <span className="font-geist tracking-[0.3em] leading-none text-ink-faint text-[9px] md:text-[10px]">DYNAMICS</span>
                  </div>
                </a>

                {/* Theme toggle — the only always-reachable home for the toggle
                    on phones (below sm the header bar hides its own). */}
                <div className="w-20 flex items-center justify-end">
                  <ThemeToggle />
                </div>
              </div>

              {/* Menu body — Joby-style two-column layout */}
              <div className="flex-1 flex flex-col md:flex-row px-8 md:px-16 lg:px-24 relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-surface-2 rounded-full blur-[150px] pointer-events-none" />

                {/* Left column — secondary links (hidden on mobile) */}
                <motion.div
                  className="hidden md:flex flex-col justify-end pb-16 w-[220px] lg:w-[260px] shrink-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <div className="flex flex-col space-y-3 mb-10">
                    {secondaryLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="text-ink-faint hover:text-ink text-sm font-geist tracking-[-0.01em] transition-colors duration-300 w-fit inline-flex items-center gap-1.5"
                      >
                        {link.name}
                        {link.external && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                            <path d="M4.5 1.5H10.5V7.5M10.5 1.5L1.5 10.5" />
                          </svg>
                        )}
                      </a>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-3 mb-10">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-faint hover:text-ink-muted text-sm font-geist tracking-[-0.01em] transition-colors duration-300 w-fit"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-2 pt-6 border-t border-line">
                    {[
                      { name: 'Privacy Policy', href: `${SITE}/privacy` },
                      { name: 'Terms of Service', href: `${SITE}/terms` },
                    ].map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="text-ink-faint hover:text-ink-muted text-xs font-geist transition-colors duration-300 w-fit"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </motion.div>

                {/* Right column — primary nav links */}
                <div className="flex-1 flex flex-col justify-center relative">
                  <div className="relative flex flex-col space-y-1">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.4, delay: 0.25 + index * 0.06, ease: [0.65, 0, 0.35, 1] }}
                      >
                        <a href={link.href} className="group flex items-baseline gap-4 py-3">
                          <span className="text-brand-cream/60 font-geist-mono text-sm tracking-wider transition-colors duration-300 group-hover:text-brand-cream">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="relative inline-block text-4xl md:text-5xl lg:text-6xl font-geist font-normal tracking-[-0.03em] leading-[1.0] transition-colors duration-300 text-ink group-hover:text-ink">
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-cream origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100" />
                          </span>
                        </a>
                      </motion.div>
                    ))}
                  </div>

                  {/* Menu CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.55 }}
                    className="mt-12"
                  >
                    <a
                      href="https://quiz.epiphanydynamics.ai"
                      onClick={() => setIsMenuOpen(false)}
                      className="site-btn-primary"
                    >
                      <span className="btn-in">Get started</span>
                      <span className="btn-out" aria-hidden="true">Get started</span>
                    </a>
                  </motion.div>

                  {/* Mobile-only secondary links (hidden on desktop where left column shows) */}
                  <motion.div
                    className="md:hidden mt-10 pt-8 border-t border-line"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <div className="flex flex-wrap gap-x-5 gap-y-1 mb-4">
                      {secondaryLinks.map((link) => (
                        <a
                          key={link.name}
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          className="text-ink-faint hover:text-ink text-sm font-geist transition-colors duration-300 inline-flex items-center gap-1.5 py-3 min-h-[44px]"
                        >
                          {link.name}
                          {link.external && (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                              <path d="M4.5 1.5H10.5V7.5M10.5 1.5L1.5 10.5" />
                            </svg>
                          )}
                        </a>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1">
                      {[
                        ...socialLinks,
                        { name: 'Privacy', href: `${SITE}/privacy` },
                        { name: 'Terms', href: `${SITE}/terms` },
                      ].map((link) => (
                        <a
                          key={link.name}
                          href={link.href}
                          target={link.name === 'LinkedIn' || link.name === 'Instagram' ? '_blank' : undefined}
                          rel={link.name === 'LinkedIn' || link.name === 'Instagram' ? 'noopener noreferrer' : undefined}
                          className="text-ink-faint hover:text-ink-muted text-xs font-geist transition-colors duration-300 py-3 min-h-[44px] inline-flex items-center"
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Menu footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="px-8 md:px-16 pb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-ink-faint text-xs tracking-wider font-geist"
              >
                <span>patrick@epiphanydynamics.ai</span>
                <span className="opacity-60">&copy; 2026 Epiphany Dynamics</span>
                <span>Nashville, TN</span>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
