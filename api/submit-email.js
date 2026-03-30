// Vercel Serverless Function — Quiz Email Submission
// Sends: (1) personalized report email to user, (2) notification to Patrick

import { buildReportHtml } from './report-templates.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, score, tier, tierLabel, tierTagline, track, insightCards, answers } = req.body

  if (!email || !tier || score === undefined) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // Build the personalized report HTML
  const reportHtml = buildReportHtml({
    email,
    score,
    track,
    tier,
    tierLabel,
    tierTagline,
    insightCards: (insightCards || []).slice(0, 3),
    answers: answers || {},
  })

  // Email to the quiz taker — full personalized report
  const userEmail = {
    from: 'Epiphany Dynamics <patrick@epiphany.help>',
    reply_to: 'patrick@epiphanydynamics.ai',
    to: email,
    subject: `Your AI Readiness Report — ${tierLabel}`,
    html: reportHtml,
  }

  // Notification email to Patrick (unchanged — just the summary table)
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
