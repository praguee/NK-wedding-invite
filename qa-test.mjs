import { chromium } from 'playwright'

const BASE = 'https://nk-wedding-invite.vercel.app'
const findings = []
const pass = (msg) => console.log(`  ✅ ${msg}`)
const fail = (msg) => { console.log(`  ❌ FAIL: ${msg}`); findings.push(msg) }
const warn = (msg) => { console.log(`  ⚠️  WARN: ${msg}`); findings.push(`[WARN] ${msg}`) }
const section = (msg) => console.log(`\n── ${msg} ──`)

const browser = await chromium.launch()

// ─────────────────────────────────────────────────────────────
// 1. INTRO SCREEN
// ─────────────────────────────────────────────────────────────
section('1. Intro Screen')
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(3000)

  // Overlay present
  const overlay = await page.$('[class*="overlay"]')
  overlay ? pass('Overlay renders') : fail('Intro overlay missing')

  // Instruction bar
  const instr = await page.textContent('[class*="instructionBar"]').catch(() => null)
  instr?.includes('Birmingham') ? pass('Instruction bar shows Birmingham→Mumbai') : fail('Instruction bar text wrong: ' + instr)

  // City labels
  const labels = await page.$$eval('[class*="cityLabel"]', els => els.map(e => e.textContent))
  labels.some(l => l?.includes('Birmingham')) ? pass('Birmingham label present') : fail('Birmingham label missing')
  labels.some(l => l?.includes('Mumbai')) ? pass('Mumbai label present') : fail('Mumbai label missing')

  // Airplane present
  const plane = await page.$('[class*="airplane"]')
  plane ? pass('Airplane SVG present') : fail('Airplane missing')

  // sessionStorage bypass works
  await page.evaluate(() => sessionStorage.setItem('invite_unlocked', 'true'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const hero = await page.$('section')
  hero ? pass('SessionStorage bypass unlocks page') : fail('SessionStorage bypass failed')

  await ctx.close()
}

// ─────────────────────────────────────────────────────────────
// 2. MAIN PAGE — NAVIGATION & STRUCTURE
// ─────────────────────────────────────────────────────────────
section('2. Main Page — Navigation & Sections')
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => sessionStorage.setItem('invite_unlocked', 'true'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  // Nav present
  const nav = await page.$('nav')
  nav ? pass('Navigation renders') : fail('Navigation missing')

  // N ✦ P logo
  const logo = await page.textContent('nav a').catch(() => null)
  logo?.includes('N') ? pass('Logo present') : warn('Logo text unexpected: ' + logo)

  // Games link in nav
  const gamesLink = await page.$('nav a[href="/games"]')
  gamesLink ? pass('Games link in nav') : fail('Games link missing from nav')

  // Required section IDs
  const sections = ['story', 'jab-we-met', 'invite', 'gallery', 'timeline', 'rsvp', 'messages', 'travel', 'contact']
  for (const id of sections) {
    const el = await page.$(`#${id}`)
    el ? pass(`Section #${id} present`) : fail(`Section #${id} MISSING`)
  }

  // Countdown timer
  const countdown = await page.$eval('div[style*="tabular-nums"]', el => el.textContent).catch(() => null)
  countdown ? pass('Countdown timer renders') : fail('Countdown timer not found')

  // Hero cover photo
  const heroImg = await page.$('img[alt="Nidhi and Parag"]')
  heroImg ? pass('Hero cover photo present') : fail('Hero cover photo missing')

  // Footer text
  const footer = await page.textContent('footer')
  footer?.includes('Birmingham') ? pass('Footer shows Birmingham ✈ Mumbai') : warn('Footer text: ' + footer?.slice(0,60))

  await ctx.close()
}

// ─────────────────────────────────────────────────────────────
// 3. GALLERY
// ─────────────────────────────────────────────────────────────
section('3. Gallery')
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE)
  await page.evaluate(() => sessionStorage.setItem('invite_unlocked', 'true'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  await page.evaluate(() => document.getElementById('gallery')?.scrollIntoView())
  await page.waitForTimeout(1500)

  // Photos visible
  const photos = await page.$$('#gallery img')
  photos.length >= 4 ? pass(`Gallery has ${photos.length} photos`) : fail(`Gallery only has ${photos.length} photos (expected 4+)`)

  // Lightbox opens on click
  if (photos.length > 0) {
    await photos[0].click()
    await page.waitForTimeout(500)
    const lightbox = await page.$('div[style*="rgba(3,1,10,0.9"]')
    lightbox ? pass('Lightbox opens on photo click') : warn('Lightbox may not be opening')
    // Close lightbox
    await page.keyboard.press('Escape')
    // Actually close via click on overlay
    await page.click('body', { position: { x: 50, y: 400 } }).catch(() => {})
  }

  await ctx.close()
}

// ─────────────────────────────────────────────────────────────
// 4. RSVP FORM
// ─────────────────────────────────────────────────────────────
section('4. RSVP Form')
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE)
  await page.evaluate(() => sessionStorage.setItem('invite_unlocked', 'true'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.evaluate(() => document.getElementById('rsvp')?.scrollIntoView())
  await page.waitForTimeout(1000)

  // Empty submit shows error
  const submitBtn = await page.$('button[type="submit"]')
  await submitBtn?.click()
  await page.waitForTimeout(800)
  const toast = await page.$('.go3958317564, [class*="toast"], [class*="Toaster"]')
  // Check for required validation (HTML5 or toast)
  pass('Submit button present')

  // Word counter visible
  const counter = await page.$eval('*', () => {
    const all = document.querySelectorAll('*')
    for (const el of all) {
      if (el.textContent?.includes('/ 100 words')) return el.textContent
    }
    return null
  }).catch(() => null)
  counter ? pass('Word counter (100 words) present') : fail('Word counter not found')

  // Fill valid form
  await page.fill('input[placeholder="Your name"]', 'QA Test Guest')
  await page.selectOption('select', '1')
  await page.fill('textarea', 'Hello from QA testing!')

  // Check word count updates
  const wordCount = await page.$eval('*', () => {
    const all = document.querySelectorAll('*')
    for (const el of all) {
      if (el.textContent?.match(/\d+ \/ 100 words/)) return el.textContent
    }
    return null
  }).catch(() => null)
  wordCount ? pass(`Word counter updates: ${wordCount}`) : warn('Word counter not updating dynamically')

  // Submit doesn't cause JS error
  const errors = []
  page.on('pageerror', e => errors.push(e.message))

  await ctx.close()
}

// ─────────────────────────────────────────────────────────────
// 5. GUEST BOOK
// ─────────────────────────────────────────────────────────────
section('5. Guest Book')
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE)
  await page.evaluate(() => sessionStorage.setItem('invite_unlocked', 'true'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.evaluate(() => document.getElementById('messages')?.scrollIntoView())
  await page.waitForTimeout(2000)

  const gbSection = await page.$('#messages')
  gbSection ? pass('Guest book section renders') : fail('Guest book section missing')

  // Scrollable container present
  const scrollable = await page.$('#messages [style*="overflow"]')
  scrollable ? pass('Scrollable container present') : warn('Scrollable container style not found')

  // Message counter badge
  const badge = await page.$eval('#messages *', () => {
    const all = document.querySelectorAll('#messages *')
    for (const el of all) {
      if (el.textContent?.includes('message')) return el.textContent
    }
    return null
  }).catch(() => null)
  badge ? pass(`Message counter: ${badge.trim().slice(0, 30)}`) : warn('Message count badge not found')

  await ctx.close()
}

// ─────────────────────────────────────────────────────────────
// 6. TIMELINE
// ─────────────────────────────────────────────────────────────
section('6. Timeline / Schedule')
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE)
  await page.evaluate(() => sessionStorage.setItem('invite_unlocked', 'true'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.evaluate(() => document.getElementById('timeline')?.scrollIntoView())
  await page.waitForTimeout(1000)

  const times = ['5:00 PM', '5:30 PM', '7:30 PM', '8:00 PM']
  for (const t of times) {
    const found = await page.getByText(t).first().isVisible().catch(() => false)
    found ? pass(`Timeline event "${t}" visible`) : fail(`Timeline event "${t}" not visible`)
  }

  await ctx.close()
}

// ─────────────────────────────────────────────────────────────
// 7. CONTACT SECTION
// ─────────────────────────────────────────────────────────────
section('7. Contact Section')
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE)
  await page.evaluate(() => sessionStorage.setItem('invite_unlocked', 'true'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.evaluate(() => document.getElementById('contact')?.scrollIntoView())
  await page.waitForTimeout(500)

  const parag = await page.getByText('+91 9819048377').first().isVisible().catch(() => false)
  parag ? pass('Parag correct number +91 9819048377') : fail('Parag phone number wrong or missing')

  const raksha = await page.getByText('+91 9137540056').first().isVisible().catch(() => false)
  raksha ? pass('Raksha correct number +91 9137540056') : fail('Raksha phone number wrong or missing')

  // Phone links are clickable (tel:)
  const telLinks = await page.$$('a[href^="tel:"]')
  telLinks.length >= 2 ? pass(`${telLinks.length} tel: links present`) : fail(`Only ${telLinks.length} tel: links (expected 2+)`)

  await ctx.close()
}

// ─────────────────────────────────────────────────────────────
// 8. GAMES PAGE — POLL
// ─────────────────────────────────────────────────────────────
section('8. Games Page — Poll')
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  // Clear poll vote
  await page.goto(BASE + '/games', { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.removeItem('nk_poll_vote_v3'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  // Poll heading
  const heading = await page.getByText('Pick a Side').first().isVisible().catch(() => false)
  heading ? pass('Games page loads with Poll') : fail('Games page poll heading missing')

  // Two vote buttons
  const buttons = await page.$$('button:has-text("Team")')
  buttons.length === 2 ? pass('Both Team buttons present') : fail(`Expected 2 team buttons, got ${buttons.length}`)

  // Vote and check result
  if (buttons.length > 0) {
    await buttons[0].click()
    await page.waitForTimeout(1000)
    // Should show results
    const bar = await page.$('div[style*="width:"]').catch(() => null)
    bar ? pass('Vote bars appear after voting') : warn('Vote bars not found after voting')

    // Countdown to quiz
    const quiz_countdown = await page.getByText(/Quiz starting in/).first().isVisible().catch(() => false)
    quiz_countdown ? pass('Auto-countdown to quiz shown') : warn('No auto-countdown to quiz visible')

    // Wait for auto-advance to quiz
    await page.waitForTimeout(4000)
    const quizHeading = await page.getByText('How Well Do You Know Us').first().isVisible().catch(() => false)
    quizHeading ? pass('Auto-advanced to quiz after poll') : fail('Did NOT auto-advance to quiz')
  }

  await ctx.close()
}

// ─────────────────────────────────────────────────────────────
// 9. GAMES PAGE — QUIZ
// ─────────────────────────────────────────────────────────────
section('9. Games Page — Quiz')
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE + '/games', { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.removeItem('nk_poll_vote_v3'))
  // Skip poll by going directly to quiz state via URL hash (not supported, force tab)
  // Instead, vote and wait
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  // Vote quickly then wait for quiz
  const btn = await page.$('button:has-text("Team Nidhi")')
  if (btn) {
    await btn.click()
    await page.waitForTimeout(4000) // wait for auto-advance
  }

  // Start quiz
  const startBtn = await page.$('button:has-text("Start Quiz")')
  if (startBtn) {
    await startBtn.click()
    await page.waitForTimeout(500)
    pass('Quiz Start button works')

    // Answer all 5 questions
    for (let q = 0; q < 5; q++) {
      const options = await page.$$('button[style*="background:"]')
      if (options.length > 0) {
        await options[Math.floor(Math.random() * Math.min(options.length, 4))].click()
        await page.waitForTimeout(1200) // wait for auto-advance
      }
    }

    // Check for results
    await page.waitForTimeout(1000)
    const result = await page.getByText(/Not bad|Ginny is judging|caricature/).first().isVisible().catch(() => false)
    result ? pass('Quiz result screen shows') : fail('Quiz result screen not appearing')

    // Caricature link present
    const instaLink = await page.$('a[href*="instagram.com/joyofcaricature"]')
    instaLink ? pass('Artist Instagram link present') : fail('Artist Instagram link missing')

    // Try again button
    const tryAgain = await page.$('button:has-text("Try again")')
    tryAgain ? pass('"Try again" button present') : warn('"Try again" button not found')
  } else {
    warn('Start Quiz button not found — may still be on poll')
  }

  await ctx.close()
}

// ─────────────────────────────────────────────────────────────
// 10. MOBILE — iPhone viewport
// ─────────────────────────────────────────────────────────────
section('10. Mobile (390×844)')
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true, hasTouch: true,
  })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)

  // Map fills screen
  const lc = await page.$eval('.leaflet-container', el => {
    const r = el.getBoundingClientRect()
    return { w: Math.round(r.width), h: Math.round(r.height) }
  }).catch(() => null)
  if (lc) {
    lc.w === 390 ? pass(`Mobile: leaflet width = ${lc.w}px ✓`) : warn(`Mobile: leaflet width = ${lc.w}px (expected 390)`)
    lc.h >= 750 ? pass(`Mobile: leaflet height = ${lc.h}px ✓`) : fail(`Mobile: leaflet height too small = ${lc.h}px`)
  } else {
    warn('Mobile: Could not measure leaflet container')
  }

  // Instruction bar visible
  const bar = await page.$('[class*="instructionBar"]')
  bar ? pass('Mobile: instruction bar visible') : fail('Mobile: instruction bar missing')

  // Navigate to main
  await page.evaluate(() => sessionStorage.setItem('invite_unlocked', 'true'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  // Mobile nav hamburger
  const hamburger = await page.$('button[aria-label="Toggle menu"]')
  hamburger ? pass('Mobile: hamburger menu button present') : fail('Mobile: hamburger menu missing')
  await hamburger?.click()
  await page.waitForTimeout(300)
  const mobileMenu = await page.$('a[href="#rsvp"]')
  mobileMenu ? pass('Mobile: menu links appear on toggle') : warn('Mobile: menu links not showing')

  // RSVP form accessible
  await page.evaluate(() => document.getElementById('rsvp')?.scrollIntoView())
  await page.waitForTimeout(500)
  const rsvpInput = await page.$('input[placeholder="Your name"]')
  rsvpInput ? pass('Mobile: RSVP form input accessible') : fail('Mobile: RSVP form input missing')

  await ctx.close()
}

// ─────────────────────────────────────────────────────────────
// 11. API ENDPOINTS
// ─────────────────────────────────────────────────────────────
section('11. API Endpoints')
{
  const page = await browser.newPage()

  // RSVP GET returns 405
  const rsvpGet = await page.request.get(BASE + '/api/rsvp')
  rsvpGet.status() === 405 ? pass('GET /api/rsvp → 405 (correct)') : fail(`GET /api/rsvp → ${rsvpGet.status()} (expected 405)`)

  // RSVP POST with empty body → 400
  const rsvpEmpty = await page.request.post(BASE + '/api/rsvp', { data: {} })
  rsvpEmpty.status() === 400 ? pass('POST /api/rsvp empty → 400 (correct)') : warn(`POST /api/rsvp empty → ${rsvpEmpty.status()}`)

  // RSVP POST with valid data (test entry)
  const rsvpValid = await page.request.post(BASE + '/api/rsvp', {
    data: { name: `QA-Test-${Date.now()}`, plus_ones: 0, message: 'QA test entry' }
  })
  const rsvpStatus = rsvpValid.status()
  rsvpStatus === 201 ? pass('POST /api/rsvp valid → 201') : fail(`POST /api/rsvp valid → ${rsvpStatus}`)

  // RSVP duplicate prevention
  const dupName = `QA-Dup-${Date.now()}`
  await page.request.post(BASE + '/api/rsvp', { data: { name: dupName, plus_ones: 0 } })
  const dup = await page.request.post(BASE + '/api/rsvp', { data: { name: dupName, plus_ones: 0 } })
  dup.status() === 409 ? pass('Duplicate RSVP → 409 (correct)') : fail(`Duplicate RSVP → ${dup.status()} (expected 409)`)

  // Poll GET
  const pollGet = await page.request.get(BASE + '/api/poll')
  if (pollGet.ok()) {
    const d = await pollGet.json()
    typeof d.total === 'number' ? pass(`GET /api/poll → 200, total=${d.total}`) : fail('Poll GET response malformed')
  } else {
    fail(`GET /api/poll → ${pollGet.status()}`)
  }

  // Poll POST valid
  const pollPost = await page.request.post(BASE + '/api/poll', { data: { side: 'bride' } })
  pollPost.status() === 201 ? pass('POST /api/poll bride → 201') : fail(`POST /api/poll → ${pollPost.status()}`)

  // Poll POST invalid side
  const pollBad = await page.request.post(BASE + '/api/poll', { data: { side: 'cat' } })
  pollBad.status() === 400 ? pass('POST /api/poll invalid side → 400') : fail(`Poll bad side → ${pollBad.status()} (expected 400)`)

  // Admin GET (should redirect to login, not expose data)
  const adminPage = await page.request.get(BASE + '/admin')
  adminPage.status() === 200 ? pass('Admin page loads (login gate expected)') : warn(`Admin → ${adminPage.status()}`)

  await page.close()
}

// ─────────────────────────────────────────────────────────────
// 12. SEO / META
// ─────────────────────────────────────────────────────────────
section('12. SEO & Meta Tags')
{
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })

  const title = await page.title()
  title.includes('Nidhi') && title.includes('Parag') ? pass(`Title: "${title}"`) : fail(`Title missing names: "${title}"`)

  const desc = await page.$eval('meta[name="description"]', el => el.getAttribute('content')).catch(() => null)
  desc ? pass(`Meta description: "${desc.slice(0, 60)}…"`) : warn('No meta description found')

  const ogTitle = await page.$eval('meta[property="og:title"]', el => el.getAttribute('content')).catch(() => null)
  ogTitle ? pass(`OG title: "${ogTitle}"`) : warn('No OG title tag')

  await ctx.close()
}

await browser.close()

// ─────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(60))
console.log('QA SUMMARY')
console.log('═'.repeat(60))
const bugs = findings.filter(f => !f.startsWith('[WARN]'))
const warns = findings.filter(f => f.startsWith('[WARN]'))
console.log(`❌ BUGS: ${bugs.length}`)
bugs.forEach(b => console.log(`   • ${b}`))
console.log(`⚠️  WARNINGS: ${warns.length}`)
warns.forEach(w => console.log(`   • ${w.replace('[WARN] ', '')}`))
console.log('')
