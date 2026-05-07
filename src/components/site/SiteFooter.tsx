const SITE = 'https://epiphanydynamics.ai'

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls = 'group relative text-[#ffffff]/50 hover:text-[#f0efeb] hover:translate-x-1 transition-all duration-300 text-sm w-fit'
  const underline = <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#f0efeb] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

  return (
    <a
      href={external ? href : `${SITE}${href}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cls}
    >
      {children}
      {underline}
    </a>
  )
}

export function SiteFooter() {
  return (
    <footer className="relative">
      <div className="bg-[#000000] relative overflow-hidden border-t border-[#ffffff]/[0.06] flex flex-col">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
        }} />

        <div className="max-w-7xl mx-auto pt-24 pb-16 px-6 md:px-10 lg:px-16 w-full flex flex-col flex-1">
          {/* Top section: Logo */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-20">
            <a href={SITE} className="flex items-center group shrink-0">
              <div className="flex flex-col">
                <span className="font-bold tracking-tight leading-none text-[#ffffff] text-xl">EPIPHANY</span>
                <span className="tracking-[0.3em] leading-none text-[#ffffff]/40 text-[10px]">DYNAMICS</span>
              </div>
            </a>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 lg:gap-16 mb-20">
            <div className="flex flex-col">
              <h4 className="text-[#ffffff] font-semibold tracking-[-0.01em] text-sm mb-6">Discover</h4>
              <div className="flex flex-col space-y-3">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/services">Services</FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/testimonials">Testimonials</FooterLink>
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-[#ffffff] font-semibold tracking-[-0.01em] text-sm mb-6">Explore</h4>
              <div className="flex flex-col space-y-3">
                <FooterLink href="https://quiz.epiphanydynamics.ai" external>AI Readiness Quiz</FooterLink>
                <FooterLink href="https://epiphanydynamics.ai/book">Book a Call</FooterLink>
                <FooterLink href="/case-studies/jason-fransos">Case Studies</FooterLink>
                <FooterLink href="/newsletter">Newsletter</FooterLink>
                <FooterLink href="https://epiphany.help" external>Learn</FooterLink>
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-[#ffffff] font-semibold tracking-[-0.01em] text-sm mb-6">Connect</h4>
              <div className="flex flex-col space-y-3">
                <FooterLink href="https://www.linkedin.com/company/epiphany-dynamics" external>LinkedIn</FooterLink>
                <FooterLink href="https://www.instagram.com/epiphanydynamics" external>Instagram</FooterLink>
                <FooterLink href="mailto:patrick@epiphanydynamics.ai" external>Email Us</FooterLink>
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-[#ffffff] font-semibold tracking-[-0.01em] text-sm mb-6">Legal</h4>
              <div className="flex flex-col space-y-3">
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 mt-12 border-t border-[#ffffff]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[#ffffff]/35 text-sm tracking-[0.15em] uppercase">&copy; 2026 Epiphany Dynamics. All rights reserved.</p>
            <p className="text-[#ffffff]/25 text-sm tracking-[0.2em] uppercase">Nashville, TN</p>
          </div>
        </div>
      </div>

      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)' }} aria-hidden="true" />
    </footer>
  )
}
