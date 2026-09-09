const SITE = 'https://epiphanydynamics.ai'

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls = 'group relative text-[#ffffff]/50 light:text-black hover:text-[#f0efeb] light:hover:text-black hover:translate-x-1 transition-all duration-300 text-sm w-fit'
  const underline = <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#f0efeb] light:bg-black origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
  const isExternal = external || href.startsWith('http') || href.startsWith('mailto:')

  return (
    <a
      href={isExternal ? href : `${SITE}${href}`}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
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
      <div className="bg-[#000000] light:bg-[#f5f2eb] relative overflow-hidden border-t border-[#ffffff]/[0.06] light:border-black/[0.12] flex flex-col">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
        }} />

        <div className="max-w-7xl mx-auto pt-24 pb-16 px-6 md:px-10 lg:px-16 w-full flex flex-col flex-1">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-20">
            <a href={SITE} className="flex items-center group shrink-0">
              <div className="flex flex-col">
                <span className="font-bold tracking-tight leading-none text-[#ffffff] light:text-black text-xl">EPIPHANY</span>
                <span className="tracking-[0.3em] leading-none text-[#ffffff]/40 light:text-black text-[10px]">DYNAMICS</span>
              </div>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 lg:gap-16 mb-20">
            <div className="flex flex-col">
              <h4 className="text-[#ffffff] light:text-black font-semibold tracking-[-0.01em] text-sm mb-6">Services</h4>
              <div className="flex flex-col space-y-3">
                <FooterLink href="/services/ai-voice-assistants/">AI Front Desk</FooterLink>
                <FooterLink href="/services/crm-integration/">CRM &amp; Workflow Automation</FooterLink>
                <FooterLink href="/services/ai-agents/">AI Agent Deployment</FooterLink>
                <FooterLink href="/services/ai-rescue/">AI Rescue</FooterLink>
                <FooterLink href="/services/web-apps/">Custom Web Apps</FooterLink>
                <FooterLink href="/services/websites/">AI-Ready Websites</FooterLink>
                <FooterLink href="/pricing/">Pricing</FooterLink>
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-[#ffffff] light:text-black font-semibold tracking-[-0.01em] text-sm mb-6">Proof</h4>
              <div className="flex flex-col space-y-3">
                <FooterLink href="/case-studies/">Case Studies</FooterLink>
                <FooterLink href="/testimonials/">Testimonials</FooterLink>
                <FooterLink href="/portfolio/">Our Work</FooterLink>
                <FooterLink href="/press/">Press</FooterLink>
                <FooterLink href="/team/patrick-gibbs/">Patrick Gibbs</FooterLink>
                <FooterLink href="/team/kim-gibbs/">Kim Gibbs</FooterLink>
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-[#ffffff] light:text-black font-semibold tracking-[-0.01em] text-sm mb-6">Explore</h4>
              <div className="flex flex-col space-y-3">
                <FooterLink href="/industries/">Industries</FooterLink>
                <FooterLink href="/locations/">Locations</FooterLink>
                <FooterLink href="/locations/ai-automation-nashville/">Nashville</FooterLink>
                <FooterLink href="/integrations/">Integrations</FooterLink>
                <FooterLink href="/alternatives/">Alternatives</FooterLink>
                <FooterLink href="/compare/">Compare</FooterLink>
                <FooterLink href="/guides/">Guides</FooterLink>
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-[#ffffff] light:text-black font-semibold tracking-[-0.01em] text-sm mb-6">Company</h4>
              <div className="flex flex-col space-y-3">
                <FooterLink href="/about/">About</FooterLink>
                <FooterLink href="/blog/">Blog</FooterLink>
                <FooterLink href="/newsletter/">Newsletter</FooterLink>
                <FooterLink href="https://book.epiphanydynamics.ai">Book a Free Audit</FooterLink>
                <FooterLink href="/privacy/">Privacy</FooterLink>
                <FooterLink href="/terms/">Terms</FooterLink>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-12 border-t border-[#ffffff]/10 light:border-black/[0.12] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[#ffffff]/35 light:text-black text-sm tracking-[0.15em] uppercase">&copy; 2026 Epiphany Dynamics. All rights reserved.</p>
            <p className="text-[#ffffff]/25 light:text-black text-sm tracking-[0.2em] uppercase">Nashville, TN</p>
          </div>
        </div>
      </div>

      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, var(--color-footer-divider) 50%, transparent 100%)' }} aria-hidden="true" />
    </footer>
  )
}
