import { useEffect, useState } from 'react'
import '@/styles/site-footer.css'

const SITE = 'https://epiphanydynamics.ai'
const BOOK = 'https://book.epiphanydynamics.ai'

const columns = [
  [
    'Services',
    [
      ['AI Front Desk', `${SITE}/services/ai-voice-assistants/`],
      ['CRM & Workflow Automation', `${SITE}/services/crm-integration/`],
      ['AI Agent Deployment', `${SITE}/services/ai-agents/`],
      ['AI Rescue', `${SITE}/services/ai-rescue/`],
      ['Custom Web Apps', `${SITE}/services/web-apps/`],
      ['AI-Ready Websites', `${SITE}/services/websites/`],
      ['Pricing', `${SITE}/pricing/`],
    ],
  ],
  [
    'Proof',
    [
      ['Case Studies', `${SITE}/case-studies/`],
      ['Testimonials', `${SITE}/testimonials/`],
      ['Our Work', `${SITE}/portfolio/`],
      ['Press', `${SITE}/press/`],
      ['Patrick Gibbs', `${SITE}/team/patrick-gibbs/`],
      ['Kim Gibbs', `${SITE}/team/kim-gibbs/`],
    ],
  ],
  [
    'Explore',
    [
      ['Industries', `${SITE}/industries/`],
      ['Locations', `${SITE}/locations/`],
      ['Nashville', `${SITE}/locations/ai-automation-nashville/`],
      ['Integrations', `${SITE}/integrations/`],
      ['Alternatives', `${SITE}/alternatives/`],
      ['Compare', `${SITE}/compare/`],
      ['Guides', `${SITE}/guides/`],
    ],
  ],
  [
    'Company',
    [
      ['About', `${SITE}/about/`],
      ['Blog', `${SITE}/blog/`],
      ['Newsletter', `${SITE}/newsletter/`],
      ['Book a Free Audit', BOOK],
      ['Privacy', `${SITE}/privacy/`],
      ['Terms', `${SITE}/terms/`],
    ],
  ],
] as const

function NashvilleClock() {
  const [value, setValue] = useState('--:-- Nashville')

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Chicago',
    })
    const tick = () => setValue(`${formatter.format(new Date())} Nashville`)
    tick()
    const id = window.setInterval(tick, 15000)
    return () => window.clearInterval(id)
  }, [])

  return <time dateTime={value.slice(0, 5)} data-hero-time>{value}</time>
}

export function SiteFooter() {
  return (
    <footer className="site-footer ed-shell-footer">
      <span className="ed-chat-entry">
        <a href="mailto:patrick@epiphanydynamics.ai">Email us</a>
      </span>
      <div className="ed-footer-columns">
        {columns.map(([heading, links]) => (
          <nav key={heading} className="ed-footer-column" aria-label={heading}>
            <h2>{heading}</h2>
            {links.map(([label, href]) => {
              const booking = href === BOOK
              return (
                <a
                  key={label}
                  className={booking ? 'ed-footer-book' : undefined}
                  href={href}
                  {...(booking ? { 'data-analytics-label': 'Book the free audit' } : {})}
                >
                  {label}
                </a>
              )
            })}
          </nav>
        ))}
      </div>
      <p className="site-footer__legal">
        <span>Epiphany Dynamics</span>
        <span>© 2026</span>
      </p>
      <p className="site-footer__meta">
        <span className="site-footer__location">
          <span className="site-footer__marker" aria-hidden="true" />
          <span>Nashville, TN</span>
        </span>
        <NashvilleClock />
      </p>
    </footer>
  )
}
