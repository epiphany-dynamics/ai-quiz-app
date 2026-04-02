// ============================================================
// AI Readiness Quiz — Personalized HTML Email Report Builder
// Source of truth for copy: /content/report-copy.md
// ============================================================

// ---- Value → key mappings ----

const INDUSTRY_MAP = { A: 'medspa', B: 'dental', C: 'home_services', D: 'restaurant', E: 'professional', F: 'ecommerce', G: 'other' }
const PAIN_MAP = { A: 'same_questions', B: 'scheduling', C: 'cold_leads', D: 'onboarding', E: 'data_entry', F: 'social_media', G: 'dont_know' }
const WISHLIST_MAP = { A: 'email', B: 'lifestyle', C: 'scheduling', D: 'research', E: 'creative' }
const BARRIER_MAP = { A: 'dont_know_start', B: 'cost', C: 'not_right', D: 'tried_failed', E: 'no_time' }
const HESITATION_MAP = { A: 'trust', B: 'privacy', C: 'complexity', D: 'value', E: 'time' }
const LEARNING_MAP = { A: 'video', B: 'self_directed', C: 'reader', D: 'guided', E: 'observational' }

// ---- Shared inline style tokens ----

const S = {
  bg: '#050505',
  text: '#f0efeb',
  muted: '#a1a1aa',
  dim: '#71717a',
  cardBg: '#0a0a0a',
  border: 'rgba(255,255,255,0.1)',
  borderFaint: 'rgba(255,255,255,0.08)',
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

function card(inner) {
  return `<div style="background:${S.cardBg};border:1px solid ${S.border};border-radius:12px;padding:20px;margin-bottom:12px;">${inner}</div>`
}

function sectionHeading(text) {
  return `<h3 style="font-size:14px;color:${S.muted};text-transform:uppercase;letter-spacing:0.05em;margin:32px 0 16px 0;">${text}</h3>`
}

function paragraph(text) {
  return `<p style="color:${S.muted};font-size:14px;line-height:1.7;margin:0 0 12px 0;">${text}</p>`
}

function cardTitle(text) {
  return `<h3 style="color:${S.text};margin:0 0 8px 0;font-size:16px;font-weight:600;">${text}</h3>`
}

function cardBody(text) {
  return `<p style="color:${S.muted};margin:0;font-size:14px;line-height:1.6;">${text}</p>`
}

// ---- Tier copy ----

const TIER_COPY = {
  // Business tiers
  ai_ready_operator: {
    headline: "You're ready to run AI. Here's your playbook.",
    summary: "You scored in the top tier of AI readiness. You already use AI tools, your operations are systematized, you see competitors moving, and you'd trust AI with customer interactions. Most businesses in your position are weeks away from a fully automated front-of-house operation. This report breaks down exactly where to start.",
    industryIntro: null,
  },
  ai_curious_builder: {
    headline: "You see the value. Here's the clearest path in.",
    summary: "You're not starting from zero. You've used AI tools, you have real business systems in place, and you can identify what's costing you time. The gap between where you are and meaningful automation isn't knowledge -- it's picking the right first move. This report gives you that move.",
    industryIntro: "Here's what businesses like yours are doing with AI right now:",
  },
  ai_aware_explorer: {
    headline: "You know AI matters. Here's where it starts making sense.",
    summary: "You're aware that AI is changing how businesses operate, but the path from \"I know this is important\" to \"I'm actually using it\" isn't clear yet. That's normal. Most business owners at your stage are 2-3 specific decisions away from real results. This report cuts through the noise and gives you the starting points that actually matter for your situation.",
    industryIntro: "Here's what's working for businesses in your industry right now -- no technical knowledge required:",
  },
  ai_newcomer: {
    headline: "You're starting at the perfect time. Here's your first move.",
    summary: "You haven't started with AI yet, and that's actually fine. The early adopters spent the last two years figuring out what works and what doesn't. You get to skip straight to what's proven. This report gives you the three things worth doing first, in plain language, with zero jargon.",
    industryIntro: "Here's what's working for businesses in your industry right now -- no technical knowledge required:",
  },
  // General tiers
  trailblazer: {
    headline: "You're in the top 10%. Here's how to stay ahead.",
    summary: "AI isn't new to you. You use it regularly, you experiment with new tools, you trust it for real decisions, and you're comfortable figuring things out on your own. This report isn't about convincing you AI is useful -- you already know that. It's about the next level: personal AI workflows, custom assistants, and compounding the advantage you already have.",
  },
  explorer: {
    headline: "You're closer to fluent than you think. Here's the bridge.",
    summary: "You're not a beginner. You use AI tools, you're interested in what's new, and you've built some real comfort. The gap between where you are and genuinely fluent isn't skill -- it's consistency. You're one good daily habit away from wondering how you ever managed without AI. This report gives you the habit.",
  },
  skeptic: {
    headline: "Your skepticism is healthy. Here's the evidence.",
    summary: "You're not sold on AI, and that's a reasonable position given the amount of hype out there. But there's a difference between healthy skepticism and missing something that could genuinely save you time. You don't need to love AI. You just need one experience that proves it's useful for you specifically. This report gives you that experience.",
  },
  fresh_start: {
    headline: "The best time to start is now. Here's exactly how.",
    summary: "You're at the very beginning with AI, and that's genuinely a great place to be right now. The people who started two years ago spent most of that time experimenting with tools that were half-baked. You get to skip straight to what actually works. This report gives you three concrete things to try -- no jargon, no pressure, no prior knowledge needed.",
  },
}

// ---- Industry blocks ----

const INDUSTRY_FULL = {
  medspa: "Your industry is one of the fastest adopters of AI front desk systems. The highest-impact move right now is automated after-hours booking. Patients who call at 9pm and get a voicemail go to your competitor. An AI receptionist that books them instantly recovers 15-25% of those lost appointments. Pair that with automated recall messaging for lapsed patients and you're looking at a measurable revenue lift within 30 days.",
  dental: "Dental practices lose the most revenue to two things: no-shows and overdue recall patients. AI-powered appointment reminders reduce no-shows by 20-35%, and automated reactivation sequences bring back overdue patients without your front desk making a single call. The second move is automating insurance verification and intake paperwork so your chair time is 100% patient time.",
  home_services: "The biggest leak in home services is speed-to-lead. A homeowner who requests a quote and doesn't hear back in 30 minutes moves on. AI-powered instant quote responses and automated follow-up sequences keep you in front of every lead. Pair that with AI-assisted crew onboarding (an assistant that answers new hire questions about procedures, routes, and equipment) and you free up your experienced people from training duty.",
  restaurant: "Restaurants benefit most from two AI applications: 24/7 reservation and catering inquiry handling (no more phone tag during service), and automated review response. AI that responds to every Google review within minutes with a personalized message dramatically improves your local search ranking and public perception.",
  professional: "For law firms, accounting practices, and consultants, the highest-ROI AI application is the intake-to-booking pipeline. Prospective clients book discovery calls, receive pre-consult questionnaires, and get intake documents automatically. Your first touchpoint with a new client is polished and immediate instead of \"someone will get back to you.\"",
  ecommerce: "Your highest-leverage AI move is cart abandonment recovery. Personalized sequences that trigger when someone leaves items in their cart typically recover 5-15% of lost sales. Second priority: automating customer support for returns, order status, and FAQs so your team only handles escalations.",
  other: "The universal starting point for any business is automating your most repetitive customer interaction. For most businesses, that's answering the same 10-15 questions over and over. An AI chat or voice system trained on your FAQs can handle 80% of routine inquiries, freeing your team for work that actually requires a human.",
}

const INDUSTRY_SIMPLE = {
  medspa: "The easiest first step is automated appointment reminders. You don't need to overhaul anything. Just connect an AI reminder system to your existing booking software. It sends confirmations and reminders automatically, and most med spas see no-show rates drop within the first two weeks.",
  dental: "Start with recall automation. AI identifies patients overdue for checkups and sends personalized messages to bring them back. It runs in the background without your staff touching anything, and it typically reactivates 8-12% of lapsed patients in the first month.",
  home_services: "Start with automated quote follow-up. When someone requests a quote and doesn't respond, AI sends a personalized nudge 24 and 72 hours later. Simple to set up, typically converts 15-25% of cold leads back into booked jobs.",
  restaurant: "Start with automated Google review responses. AI that responds to every review within minutes -- personalized, on-brand, not generic -- improves your local search ranking and takes a tedious task off your plate entirely.",
  professional: "Start with an AI-powered contact form that qualifies leads and books discovery calls automatically. Prospective clients answer a few questions, get matched to the right service, and book directly on your calendar without back-and-forth emails.",
  ecommerce: "Start with an AI chat widget that handles the top 10 customer questions (shipping times, return policy, order status). It reduces support tickets immediately and makes your store feel more professional.",
  other: "Start with whatever you answer most often. Write down the 10 questions your customers or clients ask you repeatedly. That list is your AI implementation roadmap.",
}

// ---- Pain point blocks ----

const PAIN_BLOCKS = {
  same_questions: { title: 'Answering the same questions over and over', body: "This is the easiest win in AI. Train an AI chat widget on your top 15-20 FAQs, deploy it on your website and phone system, and you'll eliminate hours of repetitive work per week. Setup takes a few hours. The time savings start the same day." },
  scheduling: { title: 'Scheduling, rescheduling, no-shows', body: "AI scheduling automation handles the entire loop: booking, confirmation, reminders, rescheduling, and waitlist management. Businesses using this typically see no-show rates drop 20-35%. The key is the reminder cadence -- AI sends the right number of reminders at the right intervals without being annoying." },
  cold_leads: { title: 'Following up with leads who go cold', body: "This is where most businesses lose the most money silently. AI-powered follow-up sequences re-engage cold leads with personalized messages on a smart cadence. Not spam, not generic blasts -- messages that reference what the lead originally asked about and offer a specific next step." },
  onboarding: { title: 'Onboarding new clients or staff', body: "AI onboarding assistants answer new hire or new client questions instantly, walk them through procedures, and flag issues to you only when a human is needed. This scales your onboarding capacity without adding headcount." },
  data_entry: { title: 'Manual data entry or reporting', body: "AI can extract, organize, and report on your business data without you touching a spreadsheet. The first step is usually connecting your existing tools (CRM, calendar, accounting) to an AI that generates weekly summaries of what's actually happening in your business." },
  social_media: { title: 'Social media / content creation', body: "AI content tools generate on-brand social posts, email campaigns, and client communications at 10x the speed of doing it manually. Set it up once with your voice, tone, and brand guidelines, and your content calendar fills itself." },
  dont_know: { title: "I don't know -- that's kind of the problem", body: "The fact that you can't pinpoint the bottleneck is actually the most important signal. It usually means the problem is operational visibility -- you're too deep in the day-to-day to see where time is actually going. An AI operations audit maps this for you in one conversation." },
}

// ---- Barrier blocks ----

const BARRIER_BLOCKS = {
  dont_know_start: { title: "I don't know where to start", body: "That's exactly what the free AI audit solves. In 30 minutes, we map your specific business to 2-3 AI tools that are already proven in your industry. You leave with a ranked list, not a sales pitch." },
  cost: { title: "I'm worried about the cost", body: "Most AI tools for small business are $0-50/month. Claude and ChatGPT are free to start. The real cost isn't the software -- it's the time you're currently spending on tasks AI could handle. A single automation that saves you 5 hours a week pays for itself instantly." },
  not_right: { title: "I'm not sure it's right for my type of business", body: "If your business involves answering customer questions, scheduling appointments, following up with leads, or creating content, AI is relevant. Those four tasks exist in every industry." },
  tried_failed: { title: "I tried it once and it didn't work well", body: "The tools have changed dramatically in the last 12 months. What didn't work a year ago probably works now. The difference is usually in the setup -- AI needs to be configured for your specific business, not used out of the box." },
  no_time: { title: "I just haven't had time", body: "That's the most common answer, and it's also the most expensive one. Every week you spend doing tasks AI could handle is a week of lost capacity. The audit call takes 30 minutes and gives you a plan you can act on when you're ready." },
}

// ---- Wishlist blocks (by tier group) ----

const WISHLIST_TRAILBLAZER = {
  email: { title: 'Managing your inbox', body: "You're ready for email triage automation. Tools like Superhuman AI or Claude-powered email workflows can categorize, draft replies, and flag priority messages. The goal is inbox zero without the effort." },
  lifestyle: { title: 'Meal planning and recipes', body: "You'd get real value from a custom Claude Project trained on your dietary preferences, household size, and cooking skill level. Ask it to generate weekly meal plans with grocery lists. It gets better every time you use it." },
  scheduling: { title: 'Scheduling and reminders', body: "Look into AI calendar assistants (Reclaim AI, Clockwise) that optimize your schedule based on your priorities, energy levels, and meeting patterns. They're a level up from basic calendar apps." },
  research: { title: 'Research and summarization', body: "You're ready for advanced research workflows. Use Claude to summarize long documents, compare sources, and extract specific data points. Build a prompt library for your most common research tasks." },
  creative: { title: 'Creative work', body: "Explore multi-modal AI workflows: Claude or ChatGPT for ideation and writing, Midjourney or DALL-E for visual concepts, and tools like Descript for audio/video editing. Chain them together for a full creative pipeline." },
}

const WISHLIST_EXPLORER = {
  email: { title: 'Managing your inbox', body: "Start simple: when you get an email that requires a long response, paste it into Claude and say \"help me draft a reply that's professional and concise.\" Do this for one week and you'll cut your email time in half." },
  lifestyle: { title: 'Meal planning and recipes', body: "Try this prompt: \"I have [list ingredients]. Give me 3 dinner options that take under 30 minutes.\" Use it once and you'll use it every week." },
  scheduling: { title: 'Scheduling and reminders', body: "Ask Claude to help you build a weekly schedule template. Describe your priorities, constraints, and energy patterns. It'll create a structure you can reuse." },
  research: { title: 'Research and summarization', body: "Next time you need to research something, paste the top 3 articles into Claude and ask \"summarize the key points and tell me what they agree and disagree on.\" Faster and more useful than reading all three." },
  creative: { title: 'Creative work', body: "Use AI as a brainstorming partner, not a replacement. Start every creative task by asking Claude for 10 ideas, pick the 2 best, then develop them yourself. The combination is better than either alone." },
}

const WISHLIST_FRESH = {
  email: { title: 'Managing your inbox', body: "Go to claude.ai. Paste an email you need to reply to. Type \"help me write a polite response.\" Done. That's AI for email." },
  lifestyle: { title: 'Meal planning', body: "Go to claude.ai. Type \"plan 5 dinners for this week for 2 people, nothing takes over 30 minutes, include a grocery list.\" That's AI for meal planning." },
  scheduling: { title: 'Scheduling', body: "Go to claude.ai. Type \"I have these 5 things to do this week [list them]. Help me figure out the best order and when to do each one.\" That's AI for scheduling." },
  research: { title: 'Research', body: "Go to claude.ai. Paste a link or copy text from something you need to read. Type \"summarize the key points in 3 bullets.\" That's AI for research." },
  creative: { title: 'Creative stuff', body: "Go to claude.ai. Type \"I need to write a [social post / birthday message / thank you note / whatever]. Here's the context: [describe it].\" That's AI for creative work." },
}

// ---- Hesitation blocks ----

const HESITATION_BLOCKS = {
  trust: { title: "I'm not sure I can trust what it tells me", body: "Valid concern. Here's the thing: AI is most useful for tasks where accuracy is easy to verify. Drafting an email (you read it before sending), summarizing a document (you skim to confirm), brainstorming ideas (you pick the good ones). Start with tasks where you're the quality check, not the AI." },
  privacy: { title: "I'm worried about privacy", body: "Both Claude and ChatGPT offer modes where your conversations aren't stored or used for training. Claude's privacy settings are straightforward. You can use AI productively without sharing anything sensitive." },
  complexity: { title: 'It feels too complicated', body: "Open claude.ai. Type a question in plain English. That's it. There's no setup, no configuration, no learning curve. If you can send a text message, you can use AI. The complexity is in advanced use cases you don't need to worry about yet." },
  value: { title: "I'm not convinced it would help me", body: "Try this one experiment: take the most tedious task you did this week and describe it to Claude. Ask it to help. If it saves you 10 minutes, that's your answer. If it doesn't, you lost 2 minutes." },
  time: { title: "I just haven't had time", body: "It takes less time to try AI than to read this report. Go to claude.ai, paste something you need to write or summarize, and see what happens. Two minutes. If it works, you just saved yourself hours going forward." },
}

// ---- Learning style blocks ----

const LEARNING_TRAILBLAZER = {
  video: "Follow channels like \"AI Explained,\" \"Matt Wolfe,\" or \"All About AI\" for advanced workflows. Skip the beginner content and search for \"advanced Claude prompting\" or \"AI automation workflows.\"",
  self_directed: "Challenge yourself: pick one task you do every week and refuse to do it manually. Force yourself to build an AI workflow for it. The constraint is the teacher.",
  reader: "Subscribe to \"The Rundown AI\" or \"Superhuman AI\" newsletters. They're curated, fast, and focused on practical use cases, not hype.",
  guided: "Find one AI-focused community (Discord, Reddit, or a local meetup). The live conversations are more current than any course.",
  observational: "Follow 2-3 AI power users on Twitter/X. Watch their workflows, then copy and adapt until it fits yours.",
}

const LEARNING_FRESH = {
  video: "Search YouTube for \"Claude AI for beginners\" or \"ChatGPT for beginners 2026.\" There are excellent 10-minute walkthroughs that make the whole thing click.",
  self_directed: "Go to claude.ai right now. Type anything. Seriously. The best intro to AI is using it, not reading about it.",
  reader: "Google \"how to use Claude AI\" -- the official getting started guide is simple and practical. 15 minutes of reading gives you everything you need to start.",
  guided: "Ask someone you know who uses AI to spend 10 minutes showing you their setup. That single conversation is worth more than any tutorial.",
  observational: "Search YouTube for \"how I use AI every day.\" Watching a real person's daily use makes AI feel practical instead of abstract.",
}

// ---- "What to do this week" blocks ----

const WEEK_STEPS = {
  ai_ready_operator: [
    "Book a 15-minute AI workflow review. We'll identify the single highest-ROI automation for your specific business -- not a generic recommendation, a specific one based on everything you told us in this quiz.",
    "While you wait for the call, write down the 3 tasks your team spends the most time on that don't directly generate revenue. That's your automation target list.",
    "Ask yourself: if you could clone one employee's work, whose would it be and what would they do? That's usually where AI fits first.",
  ],
  ai_curious_builder: [
    "Pick ONE pain point from this report that hit closest to home. Don't try to solve three things at once.",
    "Book a free 15-minute AI workflow review. We'll map that one problem to a specific, tested solution that works for your industry and team size.",
    "Before the call, check if the tool you currently use for that task has AI features you haven't turned on yet. Many CRMs and scheduling platforms already have AI built in -- you might be sitting on a solution you're already paying for.",
  ],
  ai_aware_explorer: [
    "Book a free 30-minute AI audit. You'll leave with a specific, prioritized list of what to automate first -- tailored to your business, not generic advice.",
    "Try one thing before the call: go to claude.ai and describe your biggest operational headache in plain English. Ask it to suggest three ways to solve it. The response will surprise you.",
    "Write down how many hours per week you or your team spend on tasks that don't directly generate revenue. That number is your automation ROI.",
  ],
  ai_newcomer: [
    "Go to claude.ai right now. Type: \"I run a [your business type]. What are three things AI could help me with today?\" Read the response. That's your starting point.",
    "Book a free AI audit call. No pressure, no pitch. We'll tell you the 2-3 most impactful things to automate for your specific business, and you decide if and when to act on them.",
    "Ask one person you know who uses AI in their business what they use it for. One real conversation is worth more than a hundred articles.",
  ],
  trailblazer: [
    "Pick one repetitive task you still do manually and build an AI workflow for it this week. Not someday. This week.",
    "If you haven't already, create a Custom GPT or Claude Project for your most common use case. Invest 20 minutes upfront to save hours going forward.",
    "Show one friend or colleague the most useful thing you've done with AI this month. Teaching locks in your own understanding.",
  ],
  explorer: [
    "Pick ONE task you do every week and commit to using AI for it every time this month. Not occasionally. Every time. Consistency builds fluency.",
    "Save your best prompts somewhere -- a note, a doc, anywhere. Start your prompt library with the 5 prompts that have saved you the most time so far.",
    "If you haven't tried voice mode, download Claude or ChatGPT on your phone and use voice for your next three AI interactions. It changes the experience completely.",
  ],
  skeptic: [
    "Go to claude.ai (no account needed). Paste something you need to write, summarize, or figure out. See what happens. Two minutes, zero commitment.",
    "If that works, try it again tomorrow with a different task. The second time is always faster.",
    "If you want guidance from a real person, book a free 15-minute chat. No sales pitch -- just someone who can show you the one thing worth trying for your specific situation.",
  ],
  fresh_start: [
    "Go to claude.ai. Type one thing. Anything. The first conversation is the hardest part, and it takes 30 seconds.",
    "If you liked the result, try it again tomorrow with something different. Two good experiences and the hesitation disappears.",
    "If you want a real person to show you the ropes, book a free 15-minute call. We'll walk you through the one thing that's most useful for your specific life -- not a sales pitch, just a helpful conversation.",
  ],
}

// ============================================================
// MAIN BUILDER
// ============================================================

export function buildReportHtml(data) {
  const { score, track, tier, tierLabel, tierTagline, insightCards, answers } = data
  const maxScore = track === 'business' ? 127 : 125
  const tierCopy = TIER_COPY[tier] || {}
  const isBusiness = track === 'business'
  const isGeneral = track === 'general'

  const sections = []

  // ── 1. Logo header ──
  sections.push(`
    <div style="text-align:center;margin-bottom:24px;">
      <img src="https://epiphanydynamics.ai/images/logos/new_geometric_mark.png" alt="Epiphany Dynamics" width="56" height="56" style="display:inline-block;border-radius:8px;" />
    </div>
  `)

  // ── 2. Score + tier badge ──
  sections.push(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:48px;font-weight:800;color:${S.text};margin:0 0 4px 0;line-height:1;">${score}</div>
      <div style="font-size:13px;color:${S.muted};margin-bottom:20px;">out of ${maxScore}</div>
      <div style="display:inline-block;background:${S.cardBg};border:1px solid ${S.border};border-radius:12px;padding:16px 28px;text-align:center;">
        <div style="font-size:22px;font-weight:700;color:${S.text};margin-bottom:4px;">${esc(tierLabel)}</div>
        <div style="font-size:14px;color:${S.muted};font-style:italic;">${esc(tierTagline || '')}</div>
      </div>
    </div>
  `)

  // Headline + summary
  sections.push(`
    <div style="margin-bottom:28px;">
      <h2 style="font-size:20px;font-weight:700;color:${S.text};margin:0 0 12px 0;">${esc(tierCopy.headline || '')}</h2>
      ${paragraph(tierCopy.summary || '')}
    </div>
  `)

  // ── 3. Top 3 opportunities (insight cards) ──
  const cards = (insightCards || []).slice(0, 3)
  if (cards.length) {
    sections.push(sectionHeading('Your top 3 opportunities'))
    cards.forEach(c => {
      sections.push(card(`${cardTitle(esc(c.title))}${cardBody(esc(c.body))}`))
    })
  }

  // ── 4. Industry-personalized section (business only) ──
  if (isBusiness && answers) {
    const industryKey = INDUSTRY_MAP[answers.A1]
    if (industryKey) {
      const useSimple = tier === 'ai_aware_explorer' || tier === 'ai_newcomer'
      const introLine = tierCopy.industryIntro
      const industryText = useSimple ? INDUSTRY_SIMPLE[industryKey] : INDUSTRY_FULL[industryKey]
      if (industryText) {
        sections.push(sectionHeading('Personalized for your industry'))
        if (introLine) sections.push(paragraph(introLine))
        sections.push(card(cardBody(industryText)))
      }
    }
  }

  // ── 5. Pain point section (business only) ──
  if (isBusiness && answers && answers.A4) {
    const painValues = Array.isArray(answers.A4) ? answers.A4 : [answers.A4]
    const painBlocks = painValues
      .map(v => PAIN_MAP[v])
      .filter(Boolean)
      .map(k => PAIN_BLOCKS[k])
      .filter(Boolean)
      .slice(0, 3)
    if (painBlocks.length) {
      sections.push(sectionHeading('Based on your biggest pain points'))
      painBlocks.forEach(b => {
        sections.push(card(`${cardTitle(esc(b.title))}${cardBody(b.body)}`))
      })
    }
  }

  // ── 6. Barrier section (business only, only if A6a answered) ──
  if (isBusiness && answers && answers.A6a) {
    const barrierKey = BARRIER_MAP[answers.A6a]
    const block = barrierKey && BARRIER_BLOCKS[barrierKey]
    if (block) {
      sections.push(sectionHeading("What's holding you back"))
      sections.push(card(`${cardTitle(esc(block.title))}${cardBody(block.body)}`))
    }
  }

  // ── 7. Wishlist section (general only, based on G5) ──
  if (isGeneral && answers && answers.G5) {
    const wishKey = WISHLIST_MAP[answers.G5]
    if (wishKey) {
      let wishBlock
      if (tier === 'trailblazer') wishBlock = WISHLIST_TRAILBLAZER[wishKey]
      else if (tier === 'explorer' || tier === 'skeptic') wishBlock = WISHLIST_EXPLORER[wishKey]
      else wishBlock = WISHLIST_FRESH[wishKey]
      if (wishBlock) {
        sections.push(sectionHeading('Based on what you want AI to help with'))
        sections.push(card(`${cardTitle(esc(wishBlock.title))}${cardBody(wishBlock.body)}`))
      }
    }
  }

  // ── 8. Hesitation section (general only, only if G7 answered) ──
  if (isGeneral && answers && answers.G7) {
    const hesKey = HESITATION_MAP[answers.G7]
    const block = hesKey && HESITATION_BLOCKS[hesKey]
    if (block) {
      sections.push(sectionHeading('Addressing your hesitation'))
      sections.push(card(`${cardTitle(esc(block.title))}${cardBody(block.body)}`))
    }
  }

  // ── 9. Learning style section (general only, based on G8) ──
  if (isGeneral && answers && answers.G8) {
    const learnKey = LEARNING_MAP[answers.G8]
    if (learnKey) {
      const learnText = (tier === 'trailblazer' || tier === 'explorer')
        ? LEARNING_TRAILBLAZER[learnKey]
        : LEARNING_FRESH[learnKey]
      if (learnText) {
        sections.push(sectionHeading('Your best way to learn'))
        sections.push(card(cardBody(learnText)))
      }
    }
  }

  // ── 10. What to do this week ──
  const steps = WEEK_STEPS[tier]
  if (steps && steps.length) {
    sections.push(sectionHeading('What to do this week'))
    steps.forEach((step, i) => {
      sections.push(`
        <div style="display:flex;gap:12px;margin-bottom:14px;">
          <div style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:${S.cardBg};border:1px solid ${S.border};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:${S.text};line-height:28px;text-align:center;">${i + 1}</div>
          <div style="flex:1;">
            <p style="color:${S.muted};font-size:14px;line-height:1.6;margin:0;">${step}</p>
          </div>
        </div>
      `)
    })
  }

  // ── 11. CTA button ──
  sections.push(`
    <div style="text-align:center;margin:36px 0 24px 0;padding:28px 20px;background:${S.cardBg};border-radius:12px;border:1px solid ${S.border};">
      <h3 style="font-size:18px;font-weight:700;color:${S.text};margin:0 0 10px 0;">Want to go deeper?</h3>
      <p style="color:${S.muted};font-size:14px;line-height:1.6;margin:0 0 20px 0;">This report is based on your quiz answers, but a 15-minute conversation can go much further. We'll map AI specifically to your situation -- your industry, your team, your biggest time drain -- and give you a prioritized action plan.</p>
      <a href="https://epiphanydynamics.ai/book" style="display:inline-block;background:${S.text};color:${S.bg};padding:14px 32px;border-radius:100px;text-decoration:none;font-weight:700;font-size:15px;">Book your free call</a>
    </div>
  `)

  // ── 12. Footer ──
  sections.push(`
    <div style="text-align:center;padding-top:20px;border-top:1px solid ${S.borderFaint};">
      <p style="font-size:12px;color:${S.dim};margin:0;">
        Built by <a href="https://epiphanydynamics.ai" style="color:${S.muted};text-decoration:none;">Epiphany Dynamics</a> &mdash; AI Automation for Modern Business
      </p>
    </div>
  `)

  // ── Wrap everything ──
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${S.bg};">
  <div style="background:${S.bg};color:${S.text};font-family:${S.font};padding:40px 20px;max-width:600px;margin:0 auto;">
    ${sections.join('\n')}
  </div>
</body>
</html>`
}

// Basic HTML escaping for user-provided content
function esc(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
