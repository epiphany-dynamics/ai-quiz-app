import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SITE = 'https://epiphanydynamics.ai'

const navLinks = [
  { name: 'About', href: `${SITE}/about` },
  { name: 'Services', href: `${SITE}/services` },
  { name: 'Case Studies', href: `${SITE}/case-studies/jason-fransos` },
  { name: 'Blog', href: `${SITE}/blog` },
  { name: 'Testimonials', href: `${SITE}/testimonials` },
]

const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="w-5 h-3.5 relative flex flex-col justify-between">
    <span
      className="block w-full h-[2px] rounded-full bg-white origin-center transition-transform duration-300"
      style={{
        transform: isOpen ? 'translateY(5px) rotate(45deg)' : 'none',
        transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
      }}
    />
    <span
      className="block w-full h-[2px] rounded-full bg-white origin-center transition-transform duration-300"
      style={{
        transform: isOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
        transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
      }}
    />
  </div>
)

export function SiteNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const currentY = window.scrollY
        const delta = currentY - lastY

        setIsScrolled(currentY > 80)

        if (currentY < 100) {
          setIsHidden(false)
        } else if (delta > 8) {
          setIsHidden(true)
        } else if (delta < -5) {
          setIsHidden(false)
        }

        lastY = currentY
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  const overlayLayers = [
    { color: '#0a0a0a', height: '100%', delay: 0 },
    { color: '#1a1510', height: '100%', delay: 0.08 },
    { color: '#0d0b09', height: '85%', delay: 0.16 },
    { color: '#f0efeb', height: '50%', delay: 0.24 },
  ]

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-[100] flex flex-col"
        style={{
          transform: isHidden && !isMenuOpen ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.4s cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      >
        <div className="relative px-3 md:px-5 py-2.5">
          <div
            className="absolute inset-x-3 md:inset-x-5 inset-y-2.5 pointer-events-none transition-all"
            style={{
              backgroundColor: isScrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
              backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
              WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
              borderRadius: isScrolled ? '56px' : '0px',
              border: isScrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
              boxShadow: isScrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
              opacity: isScrolled ? 1 : 0,
              transitionDuration: '400ms',
              transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
            }}
          />

          <div className="relative flex items-center justify-between px-4 md:px-6 h-[68px] md:h-[76px]">
            {/* Left: Hamburger */}
            <div className="flex items-center gap-3 relative z-10">
              <button
                type="button"
                aria-label="Toggle menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 transition-colors duration-200 min-h-[44px] min-w-[44px]"
              >
                <HamburgerIcon isOpen={isMenuOpen} />
                <span className="hidden md:inline text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300 text-white">
                  Menu
                </span>
              </button>
            </div>

            {/* Center: Logo */}
            <a
              href={SITE}
              className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2.5 group z-20 cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-bold tracking-tight leading-none text-sm md:text-base transition-colors duration-300 text-white">
                  EPIPHANY
                </span>
                <span className="tracking-[0.3em] leading-none text-[9px] md:text-[10px] transition-colors duration-300 text-white/40">
                  DYNAMICS
                </span>
              </div>
            </a>

            {/* Right: CTA */}
            <div className="z-10 hidden md:block">
              <a href="https://quiz.epiphanydynamics.ai" className="site-btn-secondary nav-cta">
                <span className="btn-in">Get started</span>
                <span className="btn-out" aria-hidden="true">Get started</span>
              </a>
            </div>
            <div className="z-10 md:hidden">
              <a href="https://quiz.epiphanydynamics.ai" className="site-btn-secondary nav-cta nav-cta-mobile">
                <span className="btn-in">Start</span>
                <span className="btn-out" aria-hidden="true">Start</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen menu overlay */}
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
              className="fixed inset-0 z-[102] flex flex-col bg-black"
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
                  className="flex items-center gap-2 text-white hover:text-[#f0efeb] transition-colors duration-200"
                >
                  <HamburgerIcon isOpen={true} />
                  <span className="hidden md:inline text-xs font-bold tracking-[0.15em] uppercase">Close</span>
                </button>

                <a
                  href={SITE}
                  className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2.5"
                >
                  <div className="flex flex-col">
                    <span className="font-bold tracking-tight leading-none text-white text-sm md:text-base">EPIPHANY</span>
                    <span className="tracking-[0.3em] leading-none text-white/40 text-[9px] md:text-[10px]">DYNAMICS</span>
                  </div>
                </a>

                <div className="w-20" />
              </div>

              {/* Menu body */}
              <div className="flex-1 flex flex-col md:flex-row px-8 md:px-16 lg:px-24 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[150px] pointer-events-none" />

                {/* Left column — secondary links */}
                <motion.div
                  className="hidden md:flex flex-col justify-end pb-16 w-[220px] lg:w-[260px] shrink-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <div className="flex flex-col space-y-3 mb-10">
                    {[
                      { name: 'Newsletter', href: `${SITE}/newsletter` },
                      { name: 'AI Readiness Quiz', href: 'https://quiz.epiphanydynamics.ai' },
                      { name: 'Book a Call', href: `${SITE}/book` },
                      { name: 'Learn', href: 'https://epiphany.help' },
                    ].map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target={link.href.startsWith(SITE) ? undefined : '_blank'}
                        rel={link.href.startsWith(SITE) ? undefined : 'noopener noreferrer'}
                        className="text-white/40 hover:text-white text-sm tracking-[-0.01em] transition-colors duration-300 w-fit inline-flex items-center gap-1.5"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {link.name}
                        {!link.href.startsWith(SITE) && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                            <path d="M4.5 1.5H10.5V7.5M10.5 1.5L1.5 10.5" />
                          </svg>
                        )}
                      </a>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-3 mb-10">
                    {[
                      { name: 'LinkedIn', href: 'https://www.linkedin.com/company/epiphany-dynamics' },
                      { name: 'Instagram', href: 'https://www.instagram.com/epiphanydynamics' },
                    ].map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-white/60 text-sm tracking-[-0.01em] transition-colors duration-300 w-fit"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-2 pt-6 border-t border-white/[0.06]">
                    {[
                      { name: 'Privacy Policy', href: `${SITE}/privacy` },
                      { name: 'Terms of Service', href: `${SITE}/terms` },
                    ].map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="text-white/20 hover:text-white/40 text-xs transition-colors duration-300 w-fit"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
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
                          <span className="text-[#f0efeb]/40 font-mono text-sm tracking-wider transition-colors duration-300 group-hover:text-[#f0efeb]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="relative inline-block text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.0] transition-colors duration-300 text-white group-hover:text-[#f0efeb]" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f0efeb] origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100" />
                          </span>
                        </a>
                      </motion.div>
                    ))}
                  </div>

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
                </div>
              </div>

              {/* Menu footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="px-8 md:px-16 pb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white/30 text-xs tracking-wider"
              >
                <span>patrick@epiphanydynamics.ai</span>
                <span className="text-white/15">&copy; 2026 Epiphany Dynamics</span>
                <span>Nashville, TN</span>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
