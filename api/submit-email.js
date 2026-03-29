// Vercel Serverless Function — Quiz Email Submission
// Sends: (1) personalized results email to user, (2) notification to Patrick

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, score, tier, tierLabel, tierTagline, track, insightCards } = req.body

  if (!email || !tier || score === undefined) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const trackLabel = track === 'business' ? 'AI Readiness Score' : 'AI Personality Type'
  const insightHtml = (insightCards || [])
    .map(
      (card) => `
      <div style="background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 12px;">
        <h3 style="color: #f0efeb; margin: 0 0 8px 0; font-size: 16px;">${card.title}</h3>
        <p style="color: #a1a1aa; margin: 0; font-size: 14px; line-height: 1.6;">${card.body}</p>
      </div>`
    )
    .join('')

  // Email to the quiz taker
  const userEmail = {
    from: 'Epiphany Dynamics <patrick@epiphany.help>',
    reply_to: 'patrick@epiphanydynamics.ai',
    to: email,
    subject: `Your ${trackLabel} Results — ${tierLabel}`,
    html: `
    <div style="background: #050505; color: #f0efeb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 28px; margin: 0 0 8px 0; color: #f0efeb;">Your ${trackLabel}</h1>
        <div style="font-size: 48px; font-weight: 800; color: #f0efeb; margin: 16px 0 4px 0;">${score}</div>
        <div style="font-size: 14px; color: #a1a1aa;">out of ${track === 'business' ? '127' : '125'}</div>
      </div>

      <div style="text-align: center; margin-bottom: 32px; padding: 20px; background: #0a0a0a; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <h2 style="font-size: 22px; margin: 0 0 6px 0; color: #f0efeb;">${tierLabel}</h2>
        <p style="font-size: 15px; color: #a1a1aa; margin: 0; font-style: italic;">${tierTagline || ''}</p>
      </div>

      <h3 style="font-size: 16px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 16px 0;">Your personalized breakdown</h3>
      ${insightHtml}

      <div style="text-align: center; margin-top: 32px; padding: 24px; background: #0a0a0a; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <p style="color: #a1a1aa; margin: 0 0 16px 0; font-size: 14px;">Want to talk through these results with a real person?</p>
        <a href="https://calendly.com/epiphanydynamics/ai-workflow-review-call" style="display: inline-block; background: #f0efeb; color: #050505; padding: 12px 28px; border-radius: 100px; text-decoration: none; font-weight: 600; font-size: 14px;">Book a free 15-min chat</a>
      </div>

      <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08);">
        <p style="font-size: 12px; color: #71717a; margin: 0;">
          <a href="https://epiphanydynamics.ai" style="color: #a1a1aa; text-decoration: none;">Epiphany Dynamics</a> — AI Automation for Modern Business
        </p>
      </div>
    </div>
    `,
  }

  // Notification email to Patrick
  const notifyEmail = {
    from: 'Quiz Alert <patrick@epiphany.help>',
    to: 'patrick@epiphanydynamics.ai',
    subject: `Quiz Lead: ${tierLabel} (${score}pts) — ${email}`,
    html: `
    <div style="font-family: -apple-system, sans-serif; padding: 20px;">
      <h2>New quiz submission</h2>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Email</td><td>${email}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Track</td><td>${track}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Score</td><td>${score}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Tier</td><td>${tierLabel}</td></tr>
      </table>
    </div>
    `,
  }

  try {
    // Send both emails in parallel
    const [userRes, notifyRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(userEmail),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(notifyEmail),
      }),
    ])

    if (!userRes.ok) {
      const err = await userRes.text()
      console.error('Resend user email failed:', err)
    }
    if (!notifyRes.ok) {
      const err = await notifyRes.text()
      console.error('Resend notify email failed:', err)
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Email send error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
