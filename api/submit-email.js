// Vercel Serverless Function — Quiz Email Submission
// Sends: (1) personalized report email to user, (2) notification to Patrick

import { buildReportHtml } from './report-templates.js'

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, score, tier, tierLabel, tierTagline, track, insightCards, answers, readableAnswers, source } = req.body

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

  // Their actual quiz answers, human-readable (Q -> chosen answer)
  const answerRows = (readableAnswers || [])
    .map(a => `<tr><td style="padding:6px 14px 6px 0; font-weight:600; vertical-align:top; color:#111;">${escapeHtml(a.question)}</td><td style="padding:6px 0; color:#333;">${escapeHtml(a.answer)}</td></tr>`)
    .join('')
  const answersBlock = answerRows
    ? `<h3 style="margin:24px 0 8px;">Their answers</h3><table style="border-collapse:collapse; font-size:14px; max-width:640px;">${answerRows}</table>`
    : ''

  // Where the lead came from (referrer / UTM / click ids)
  const sourceEntries = Object.entries(source || {})
  const sourceBlock = sourceEntries.length
    ? `<h3 style="margin:24px 0 8px;">Where they came from</h3><table style="border-collapse:collapse; font-size:14px; max-width:640px;">${sourceEntries
        .map(([k, v]) => `<tr><td style="padding:4px 14px 4px 0; font-weight:600; color:#111;">${escapeHtml(k)}</td><td style="padding:4px 0; color:#333; word-break:break-all;">${escapeHtml(v)}</td></tr>`)
        .join('')}</table>`
    : `<p style="font-size:13px; color:#888; margin:24px 0 0;">Where they came from: direct / not captured</p>`

  // Notification email to Patrick — summary + their answers + traffic source
  const notifyEmail = {
    from: 'Quiz Alert <patrick@epiphany.help>',
    to: 'patrick@epiphanydynamics.ai',
    subject: `Quiz Lead: ${tierLabel} (${score}pts) — ${email}`,
    html: `
    <div style="font-family: -apple-system, sans-serif; padding: 20px;">
      <h2>New quiz submission</h2>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Email</td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Track</td><td>${escapeHtml(track)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Score</td><td>${score}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Tier</td><td>${escapeHtml(tierLabel)}</td></tr>
      </table>
      ${answersBlock}
      ${sourceBlock}
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
