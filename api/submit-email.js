// Vercel Serverless Function — Quiz Email Submission
// Sends: (1) personalized report email to user, (2) notification to Patrick

import { buildReportHtml } from './report-templates.js'

const TRACK_A_LABELS = {
  A1: { A: 'Med spa / wellness / aesthetics', B: 'Dental or healthcare practice', C: 'Home services (plumbing, HVAC, landscaping, etc.)', D: 'Restaurant / food & beverage', E: 'Professional services (legal, accounting, consulting)', F: 'E-commerce / retail', G: 'Other' },
  A2: { A: 'Just me', B: '2-5 people', C: '6-20 people', D: '21+ people' },
  A3: { A: 'Pre-revenue / just getting started', B: 'Making money but inconsistent', C: 'Steady revenue, looking to scale', D: 'Scaling fast, operations are straining' },
  A4: { A: 'Same questions from leads/clients over and over', B: 'Scheduling, rescheduling, no-shows', C: 'Following up with leads who go cold', D: 'Onboarding new clients or staff', E: 'Manual data entry or reporting', F: 'Social media / content creation', G: "I don't know, that's kind of the problem" },
  A5: { A: 'Never used AI in my business', B: 'Use ChatGPT occasionally for writing', C: 'A couple of AI tools integrated into workflow', D: 'AI is already deeply embedded in operations' },
  A6a: { A: "Don't know where to start", B: 'Worried about the cost', C: "Not sure it's right for my type of business", D: "Tried it once and it didn't work well", E: "Just haven't had time to figure it out" },
  A7: { A: 'After-hours self-booking scenario', B: 'Smart follow-up for ghosted leads', C: 'AI handles 80% of FAQs / customer questions', D: 'Weekly AI-generated revenue / job-mix report' },
  A8: { A: 'Under $200/mo, need proof first', B: '$200-500/mo if ROI is clear', C: '$500-1,500/mo for something that works', D: 'Whatever it costs, need this solved now' },
  A9: { A: 'Needs time to research and think (slow)', B: 'A few weeks, wants a demo first (medium)', C: 'Within a week if it looks right (fast)', D: 'Ready to start tomorrow (HOT)' },
  A10: { A: "Yes, it's my business, my call", B: 'Would loop in a partner / team member', C: 'Would need approval from above' },
}

const TRACK_B_LABELS = {
  B1: { A: 'Student / learning', B: 'Working a 9-to-5', C: 'Freelancer / creative', D: 'Stay-at-home parent / caretaker', E: 'Retired / semi-retired', F: 'Job hunting / in transition' },
  B2: { A: 'Never touched AI tools', B: 'Tried once or twice', C: 'Use occasionally', D: 'Use regularly', E: 'Use almost every day' },
  B3a: { A: "Don't really understand what they do", B: 'Worried about privacy and data', C: "Don't think I need it", D: 'Mixed reviews, not convinced', E: "Just haven't had a reason to try" },
  B3b: { A: 'Writing / editing', B: 'Research / quick answers', C: 'Creative stuff', D: 'Coding / technical', E: 'Personal organization', F: 'Messing around / exploring' },
  B5: { A: 'AI takes jobs away', B: 'Misinformation / hard to trust', C: 'Isolation / dependency', D: 'Corporate control / manipulation', E: 'Not that worried', F: 'More excited than concerned' },
  B6: { A: 'Morning briefing AI', B: 'Writing assistant AI', C: 'AI tutor', D: 'Finance AI', E: 'Companion / decisions AI' },
  B7: { A: 'Significantly better', B: 'Better for some, worse for others', C: 'About the same / new normal', D: 'More complicated', E: "Genuinely don't know" },
  B8: { A: 'Save time in daily life', B: 'Understand the tech', C: 'Build something with AI', D: 'Jobs, society, future impact', E: 'Need someone to point me' },
  B9: { A: "Definitely, I'd post it", B: 'Maybe if it nails me perfectly', C: 'Probably not, keep it private' },
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function formatAnswerValue(qid, value, track) {
  const labels = track === 'business' ? TRACK_A_LABELS : TRACK_B_LABELS
  const map = labels[qid]
  if (qid === 'A6b' || qid === 'B4') return `${value} / 10 (slider)`
  if (Array.isArray(value)) {
    if (!map) return value.join(', ')
    return value.map(v => map[v] ?? v).join(' • ')
  }
  if (map && map[value]) return `${value} - ${map[value]}`
  return String(value)
}

function calcLeadScore(answers) {
  let s = 0
  if (answers?.A9 === 'D') s += 30
  else if (answers?.A9 === 'C') s += 20
  if (answers?.A10 === 'A') s += 20
  if (answers?.A8 === 'D') s += 30
  else if (answers?.A8 === 'C') s += 20
  else if (answers?.A8 === 'B') s += 10
  const painCount = Array.isArray(answers?.A4) ? answers.A4.length : 0
  s += painCount * 5
  return Math.min(s, 100)
}

function buildAnswersTable(answers, track) {
  if (!answers || typeof answers !== 'object') return '<p style="color:#9ca3af;">No answer data captured.</p>'
  const order = track === 'business'
    ? ['A1', 'A2', 'A3', 'A4', 'A5', 'A6a', 'A6b', 'A7', 'A8', 'A9', 'A10']
    : ['B1', 'B2', 'B3a', 'B3b', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9']
  const rows = order
    .filter(qid => answers[qid] !== undefined && answers[qid] !== null && answers[qid] !== '')
    .map(qid => {
      const formatted = formatAnswerValue(qid, answers[qid], track)
      return `<tr><td style="padding:6px 14px 6px 0;font-weight:600;color:#06b6d4;vertical-align:top;width:60px;">${qid}</td><td style="padding:6px 0;color:#e5e7eb;">${escapeHtml(formatted)}</td></tr>`
    })
    .join('')
  return `<table style="border-collapse:collapse;font-size:13px;width:100%;margin-top:8px;">${rows}</table>`
}

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

  // Notification email to Patrick — full lead intake (answers, lead score, tier)
  const leadScore = calcLeadScore(answers)
  const leadTier = leadScore >= 80 ? 'HOT' : leadScore >= 50 ? 'WARM' : 'NURTURE'
  const leadTierColor = leadScore >= 80 ? '#ef4444' : leadScore >= 50 ? '#f59e0b' : '#6b7280'
  const answersTable = buildAnswersTable(answers, track)

  const notifyEmail = {
    from: 'Quiz Alert <patrick@epiphany.help>',
    to: 'patrick@epiphanydynamics.ai',
    subject: `Quiz Lead [${leadTier}]: ${tierLabel} (${score}pts) — ${email}`,
    html: `
    <div style="font-family:-apple-system,sans-serif;padding:24px;background:#0f172a;color:#e5e7eb;max-width:680px;">
      <h2 style="margin:0 0 4px;color:#06b6d4;font-size:18px;">New quiz submission</h2>
      <p style="margin:0 0 20px;color:#9ca3af;font-size:13px;">${escapeHtml(new Date().toISOString())}</p>

      <table style="border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <tr><td style="padding:4px 14px 4px 0;color:#9ca3af;">Email</td><td><a href="mailto:${escapeHtml(email)}" style="color:#06b6d4;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#9ca3af;">Track</td><td>${escapeHtml(track || '?')}</td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#9ca3af;">Score</td><td><strong>${score} / 100</strong></td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#9ca3af;">Tier</td><td><strong>${escapeHtml(tierLabel || tier)}</strong></td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#9ca3af;">Tagline</td><td style="color:#cbd5e1;font-style:italic;">${escapeHtml(tierTagline || '')}</td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#9ca3af;">Lead score</td><td><span style="background:${leadTierColor};color:#fff;padding:2px 8px;border-radius:4px;font-weight:700;font-size:12px;">${leadTier} (${leadScore}/100)</span></td></tr>
      </table>

      <h3 style="margin:0 0 4px;color:#06b6d4;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;">Full answer breakdown</h3>
      <div style="border-left:3px solid #06b6d4;padding-left:12px;">
        ${answersTable}
      </div>
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
