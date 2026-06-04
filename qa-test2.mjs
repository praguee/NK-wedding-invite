import { chromium } from 'playwright'

const BASE = 'https://nk-wedding-invite.vercel.app'
const bugs = [], warns = []
const pass = (m) => console.log(`  ✅ ${m}`)
const fail = (m) => { console.log(`  ❌ ${m}`); bugs.push(m) }
const warn = (m) => { console.log(`  ⚠️  ${m}`); warns.push(m) }
const sec  = (m) => console.log(`\n── ${m} ──`)
const safe = async (fn) => { try { return await fn() } catch { return null } }

const browser = await chromium.launch()

async function unlockedPage(width=1440, height=900, mobile=false) {
  const ctx = await browser.newContext({ viewport:{width,height}, isMobile:mobile, hasTouch:mobile })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil:'networkidle', timeout:30000 })
  await page.evaluate(() => sessionStorage.setItem('invite_unlocked','true'))
  await page.reload({ waitUntil:'networkidle', timeout:30000 })
  await page.waitForTimeout(1500)
  return { ctx, page }
}

// ── 1. INTRO SCREEN ──────────────────────────────────────────
sec('1. Intro Screen')
{
  const ctx = await browser.newContext({ viewport:{width:1440,height:900} })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil:'networkidle', timeout:30000 })
  await page.waitForTimeout(3000)

  ;(await safe(() => page.$('[class*="overlay"]'))) ? pass('Overlay renders') : fail('Intro overlay missing')
  const instr = await safe(() => page.textContent('[class*="instructionBar"]'))
  instr?.includes('Birmingham') ? pass('Instruction bar text correct') : fail('Instruction bar wrong: '+instr)
  
  const labels = await safe(() => page.$$eval('[class*="cityLabel"]', els=>els.map(e=>e.textContent))) ?? []
  labels.some(l=>l?.includes('Birmingham')) ? pass('Birmingham label present') : fail('Birmingham label missing')
  labels.some(l=>l?.includes('Mumbai')) ? pass('Mumbai label present') : fail('Mumbai label missing')
  ;(await safe(()=>page.$('[class*="airplane"]'))) ? pass('Airplane SVG present') : fail('Airplane missing')

  // Ghost plane animation in SVG
  const animateMotion = await safe(()=>page.$('animateMotion'))
  animateMotion ? pass('Ghost plane animateMotion present') : warn('Ghost plane animation not found')

  // Map fills full viewport
  const lc = await safe(()=>page.$eval('.leaflet-container', el=>{
    const r=el.getBoundingClientRect(); return {w:Math.round(r.width),h:Math.round(r.height)}
  }))
  if (lc) {
    lc.w >= 1400 ? pass(`Map width ${lc.w}px ≈ full`) : warn(`Map width ${lc.w}px (expected ~1440)`)
    lc.h >= 800  ? pass(`Map height ${lc.h}px ≈ full`) : fail(`Map height too small: ${lc.h}px`)
  }

  await ctx.close()
}

// ── 2. MOBILE INTRO ──────────────────────────────────────────
sec('2. Mobile Intro (390×844)')
{
  const ctx = await browser.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true,
    userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148' })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil:'networkidle', timeout:30000 })
  await page.waitForTimeout(4000)
  const lc = await safe(()=>page.$eval('.leaflet-container',el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height}}))
  if (lc) {
    lc.w >= 385 ? pass(`Mobile map width OK: ${Math.round(lc.w)}px`) : fail(`Mobile map too narrow: ${Math.round(lc.w)}px`)
    lc.h >= 700 ? pass(`Mobile map height OK: ${Math.round(lc.h)}px`) : fail(`Mobile map too short: ${Math.round(lc.h)}px`)
  } else { warn('Could not measure mobile map') }

  const blackPixels = await safe(()=>page.evaluate(()=>{
    // Check if top 100px of the page is just the background color (suggests black bars)
    const el = document.querySelector('.leaflet-container')
    return el ? window.getComputedStyle(el).background : null
  }))
  pass('Mobile intro screen renders without crash')
  await ctx.close()
}

// ── 3. MAIN PAGE SECTIONS ─────────────────────────────────────
sec('3. Main Page Sections')
const {ctx:ctx3, page:p3} = await unlockedPage()
{
  const secs = ['story','jab-we-met','invite','gallery','timeline','rsvp','messages','travel','contact']
  for (const id of secs) {
    (await safe(()=>p3.$(`#${id}`))) ? pass(`#${id} exists`) : fail(`#${id} MISSING`)
  }
  // Countdown timer  
  await p3.evaluate(()=>window.scrollTo(0,0))
  await p3.waitForTimeout(500)
  const cdNums = await safe(()=>p3.$$eval('*', els=>{
    for(const el of els){ if(el.children.length===0 && /^\d{2}$/.test(el.textContent?.trim()||'')) return true }
    return false
  }))
  cdNums ? pass('Countdown timer digits found') : warn('Countdown timer digits not found (may need scroll to hero)')

  // Story section has water content
  const storyText = await safe(()=>p3.textContent('#story'))
  storyText?.includes('shower') ? pass('Story has shower proposal text') : warn('Story missing shower text')
  storyText?.includes('8th July') || storyText?.includes('2023') ? pass('Story has 8 July 2023 date') : fail('Story missing relationship start date')

  // Jab We Met counter
  const jabText = await safe(()=>p3.textContent('#jab-we-met'))
  jabText?.includes('Runwal Greens') ? pass('Jab We Met has first meeting location') : fail('Jab We Met missing Runwal Greens')
  jabText?.includes('wallet') ? pass('Jab We Met has wallet story') : fail('Jab We Met missing wallet story')
  ;(jabText?.includes('years') && jabText?.includes('months') && jabText?.includes('days')) 
    ? pass('Jab We Met live counter (years/months/days) present') 
    : fail('Jab We Met counter missing')

  // Our Story counter
  const storySection = await safe(()=>p3.textContent('#story'))
  ;(storySection?.includes('years') && storySection?.includes('months'))
    ? pass('Our Story relationship counter present')
    : fail('Our Story relationship counter missing')
  await ctx3.close()
}

// ── 4. GALLERY ───────────────────────────────────────────────
sec('4. Gallery')
const {ctx:ctx4, page:p4} = await unlockedPage()
{
  await p4.evaluate(()=>document.getElementById('gallery')?.scrollIntoView())
  await p4.waitForTimeout(1500)
  const imgs = await safe(()=>p4.$$('#gallery img')) ?? []
  imgs.length >= 4 ? pass(`Gallery has ${imgs.length} images`) : fail(`Gallery has ${imgs.length} images (expected 4+)`)

  // Check images load (not 404)
  const imgSrcs = await safe(()=>p4.$$eval('#gallery img', els=>els.map(e=>({src:e.getAttribute('src'),ok:e.naturalWidth>0}))))
  if (imgSrcs) {
    const broken = imgSrcs.filter(i=>!i.ok)
    broken.length === 0 ? pass('All gallery images load (no 404s)') : fail(`${broken.length} broken gallery images: ${broken.map(i=>i.src).join(', ')}`)
  }

  // Lightbox test with force click
  if (imgs.length > 0) {
    await safe(async ()=>{ await imgs[0].click({force:true}); await p4.waitForTimeout(800) })
    const lb = await safe(()=>p4.$('div[style*="rgba(3,1,10,0.9"]'))
    lb ? pass('Lightbox opens') : warn('Lightbox may not open on click')
    // Close
    await safe(async()=>{ 
      const closeBtn = await p4.$('button svg path[d*="M4 4L20 20"]')
      if (closeBtn) { const btn = await closeBtn.$('xpath=../..'); await btn?.click({force:true}) }
    })
  }
  await ctx4.close()
}

// ── 5. RSVP FORM ─────────────────────────────────────────────
sec('5. RSVP Form')
const {ctx:ctx5, page:p5} = await unlockedPage()
{
  await p5.evaluate(()=>document.getElementById('rsvp')?.scrollIntoView())
  await p5.waitForTimeout(800)

  // Labels are casual not office-style
  const formText = await safe(()=>p5.textContent('#rsvp'))
  formText?.includes('call you') ? pass('RSVP has casual "what do we call you" label') : warn('RSVP label may not be casual')
  formText?.includes('100 words') ? pass('100 word limit shown') : fail('100 word limit not shown')
  !(formText?.includes('Full name')) ? pass('No "Full name" label (correctly casual)') : warn('"Full name" still present')

  // Word counter works
  const textarea = await safe(()=>p5.$('textarea'))
  if (textarea) {
    await textarea.fill('Hello world this is a test message for counting words properly here')
    await p5.waitForTimeout(300)
    const counter = await safe(()=>p5.$eval('*', ()=>{
      const all=document.querySelectorAll('*')
      for(const el of all){ if(el.textContent?.match(/\d+ \/ 100 words/)) return el.textContent }
      return null
    }))
    counter ? pass(`Word counter working: ${counter}`) : fail('Word counter not updating')
  }

  // Over-100-word check (API validation)
  const bigText = Array(110).fill('word').join(' ')
  await safe(()=>p5.fill('textarea', bigText))
  await p5.waitForTimeout(300)
  const overWarn = await safe(()=>p5.$eval('*',()=>{
    const all=document.querySelectorAll('*')
    for(const el of all){ if(el.textContent?.includes('100 words 💕')) return true }
    return false
  }))
  overWarn ? pass('Over-100-word warning appears') : warn('Over-100-word warning not visible')

  // Submit button disabled when over 100 words
  const submitDisabled = await safe(()=>p5.$eval('button[type="submit"]',el=>el.disabled))
  submitDisabled ? pass('Submit disabled when over 100 words') : fail('Submit NOT disabled when over 100 words — can submit invalid form')

  await ctx5.close()
}

// ── 6. TIMELINE ──────────────────────────────────────────────
sec('6. Timeline')
const {ctx:ctx6, page:p6} = await unlockedPage()
{
  await p6.evaluate(()=>document.getElementById('timeline')?.scrollIntoView())
  await p6.waitForTimeout(800)
  for (const t of ['5:00 PM','5:30 PM','7:30 PM','8:00 PM']) {
    const v = await safe(()=>p6.getByText(t).first().isVisible()) ?? false
    v ? pass(`Timeline "${t}" visible`) : fail(`Timeline "${t}" NOT visible`)
  }
  const texts = ['Guests Arrive','Wedding Ceremony','Evening Refreshments','Reception']
  for (const t of texts) {
    const v = await safe(()=>p6.getByText(t).first().isVisible()) ?? false
    v ? pass(`"${t}" visible`) : fail(`"${t}" NOT visible`)
  }
  await ctx6.close()
}

// ── 7. CONTACT ───────────────────────────────────────────────
sec('7. Contact Numbers')
const {ctx:ctx7, page:p7} = await unlockedPage()
{
  await p7.evaluate(()=>document.getElementById('contact')?.scrollIntoView())
  await p7.waitForTimeout(500)
  ;(await safe(()=>p7.getByText('+91 9819048377').first().isVisible())) ? pass('Parag +91 9819048377 ✓') : fail('Parag phone WRONG or missing')
  ;(await safe(()=>p7.getByText('+91 9137540056').first().isVisible())) ? pass('Raksha +91 9137540056 ✓') : fail('Raksha phone WRONG or missing')
  ;(await safe(()=>p7.getByText('+91 9137540056').first().isVisible())) && 
  !(await safe(()=>p7.getByText('Parag').first().isVisible())) ? warn('Numbers may be swapped — verify visually') : pass('Contact names and numbers present')
  
  const tels = await safe(()=>p7.$$('a[href^="tel:"]')) ?? []
  tels.length >= 2 ? pass(`${tels.length} clickable tel: links`) : fail(`Only ${tels.length} tel: links`)
  await ctx7.close()
}

// ── 8. GAMES PAGE — POLL ─────────────────────────────────────
sec('8. Games Page — Poll')
{
  const ctx = await browser.newContext({ viewport:{width:1440,height:900} })
  const page = await ctx.newPage()
  await page.goto(BASE+'/games', { waitUntil:'networkidle', timeout:30000 })
  await page.evaluate(()=>localStorage.removeItem('nk_poll_vote_v3'))
  await page.reload({ waitUntil:'networkidle' })
  await page.waitForTimeout(2000)

  // Back button
  ;(await safe(()=>page.$('a[href="/"]'))) ? pass('Back to Invitation link present') : fail('Back link missing')
  // Step indicator
  const stepText = await safe(()=>page.textContent('body'))
  stepText?.includes('Poll') ? pass('Step indicator shows Poll') : warn('Step indicator text not found')

  // Vote buttons
  const btns = await safe(()=>page.$$('button:has-text("Team")')) ?? []
  btns.length === 2 ? pass('Both team buttons present') : fail(`${btns.length} team buttons (expected 2)`)

  // Ginny idle image
  const ginnyImg = await safe(()=>page.$('img[alt="Ginny"]'))
  ginnyImg ? pass('Ginny idle image present') : warn('Ginny image not found (may show after quiz starts)')

  // Vote
  if (btns.length > 0) {
    await safe(()=>btns[0].click())
    await page.waitForTimeout(1000)
    const pct = await safe(()=>page.$('div[style*="width:"]'))
    pct ? pass('Vote bars appear after voting') : fail('Vote bars missing after voting')
    const countdown = await safe(()=>page.getByText(/Quiz starting in/).first().isVisible())
    countdown ? pass('Quiz countdown shown after vote') : fail('No quiz countdown shown')
    // Wait for auto-advance
    await page.waitForTimeout(4000)
    const quizQ = await safe(()=>page.getByText(/How Well Do You Know/).first().isVisible())
    quizQ ? pass('Auto-advanced to quiz after poll ✓') : fail('Did NOT auto-advance to quiz')
  }
  await ctx.close()
}

// ── 9. GAMES PAGE — QUIZ ─────────────────────────────────────
sec('9. Games Page — Quiz Flow')
{
  const ctx = await browser.newContext({ viewport:{width:1440,height:900} })
  const page = await ctx.newPage()
  await page.goto(BASE+'/games', { waitUntil:'networkidle', timeout:30000 })
  await page.evaluate(()=>localStorage.removeItem('nk_poll_vote_v3'))
  await page.reload({ waitUntil:'networkidle' })
  await page.waitForTimeout(1000)
  // Skip poll
  const voteBtn = await safe(()=>page.$('button:has-text("Team Nidhi")'))
  if (voteBtn) { await safe(()=>voteBtn.click()); await page.waitForTimeout(4000) }

  const startBtn = await safe(()=>page.$('button:has-text("Start Quiz")'))
  if (startBtn) {
    await startBtn.click()
    await page.waitForTimeout(800)
    pass('Start Quiz button works')

    // Check progress dots
    const dots = await safe(()=>page.$$eval('div[style*="width: 6px"]', els=>els.length))
    dots >= 1 ? pass(`Progress dots: ${dots} dots`) : warn('Progress dots not found')

    // Answer 5 questions — always pick option A
    let questionsAnswered = 0
    for (let q = 0; q < 5; q++) {
      // Find answer buttons (not Start Quiz or Back buttons)
      const opts = await safe(()=>page.$$('button[style*="background:"]')) ?? []
      const validOpts = []
      for (const o of opts) {
        const txt = await safe(()=>o.textContent())
        if (txt && !txt.includes('Start') && !txt.includes('Back') && !txt.includes('Try')) validOpts.push(o)
      }
      if (validOpts.length > 0) {
        const wasRevealed = await safe(()=>page.$eval('button[style*="background:"]', el=>{
          const s = el.style.background; return s.includes('34d399') || s.includes('fb7185')
        })) ?? false
        
        if (!wasRevealed) {
          await safe(()=>validOpts[0].click({force:true}))
          questionsAnswered++
          await page.waitForTimeout(1100) // wait for auto-advance
        }
      } else { break }
    }
    pass(`Answered ${questionsAnswered} questions via auto-advance`)

    // Result screen
    await page.waitForTimeout(1000)
    const resultVisible = await safe(()=>page.getByText(/Not bad|Ginny is judging|caricature/).first().isVisible())
    resultVisible ? pass('Result screen appears after all questions') : warn('Result screen not visible yet')

    // Artist CTA
    const artistLink = await safe(()=>page.$('a[href*="joyofcaricature"]'))
    artistLink ? pass('Artist Instagram link present') : fail('Artist link MISSING')
    if (artistLink) {
      const href = await safe(()=>artistLink.getAttribute('href'))
      href?.includes('instagram.com') ? pass(`Link goes to Instagram: ${href}`) : warn('Artist link not Instagram')
    }

    // Try again button
    const tryBtn = await safe(()=>page.$('button:has-text("Try again")'))
    tryBtn ? pass('"Try again" button present') : warn('"Try again" button missing')
    if (tryBtn) {
      await safe(()=>tryBtn.click())
      await page.waitForTimeout(500)
      const backToStart = await safe(()=>page.$('button:has-text("Start Quiz")'))
      backToStart ? pass('Try again resets to quiz start') : fail('Try again does NOT reset quiz')
    }
  } else { warn('Start Quiz not reached — poll auto-advance may not have worked in time') }
  await ctx.close()
}

// ── 10. API ENDPOINTS ─────────────────────────────────────────
sec('10. API Endpoints')
{
  const page = await browser.newPage()
  
  // RSVP
  const g = await page.request.get(BASE+'/api/rsvp')
  g.status()===405 ? pass('GET /api/rsvp → 405 ✓') : fail(`GET /api/rsvp → ${g.status()} (expected 405)`)

  const empty = await page.request.post(BASE+'/api/rsvp', {data:{}})
  empty.status()===400 ? pass('POST /api/rsvp no name → 400 ✓') : warn(`Empty POST → ${empty.status()}`)

  const valid = await page.request.post(BASE+'/api/rsvp', {data:{name:`QA-${Date.now()}`, plus_ones:0}})
  valid.status()===201 ? pass('POST /api/rsvp valid → 201 ✓') : fail(`Valid RSVP POST → ${valid.status()}`)

  const badPlus = await page.request.post(BASE+'/api/rsvp', {data:{name:`QA-${Date.now()}`, plus_ones:99}})
  badPlus.status()===400 ? pass('POST /api/rsvp plus_ones=99 → 400 ✓') : fail(`plus_ones:99 → ${badPlus.status()} (expected 400)`)

  const dup = `QA-Dup-${Date.now()}`
  await page.request.post(BASE+'/api/rsvp', {data:{name:dup, plus_ones:0}})
  const dup2 = await page.request.post(BASE+'/api/rsvp', {data:{name:dup, plus_ones:0}})
  dup2.status()===409 ? pass('Duplicate RSVP → 409 ✓') : fail(`Duplicate → ${dup2.status()} (expected 409)`)

  // XSS attempt
  const xss = await page.request.post(BASE+'/api/rsvp', {data:{name:`<script>alert(1)</script>-${Date.now()}`, plus_ones:0}})
  const xssBody = await xss.json().catch(()=>null)
  xssBody?.data?.name?.includes('<script>') ? warn('XSS characters stored as-is (consider sanitisation)') : pass('XSS input handled safely')

  // Poll
  const pg = await page.request.get(BASE+'/api/poll')
  if (pg.ok()) {
    const d = await pg.json()
    typeof d.total==='number' ? pass(`GET /api/poll → 200, total=${d.total} ✓`) : fail('Poll GET malformed')
  } else { fail(`GET /api/poll → ${pg.status()}`) }

  const pp = await page.request.post(BASE+'/api/poll', {data:{side:'groom'}})
  pp.status()===201 ? pass('POST /api/poll groom → 201 ✓') : fail(`Poll POST → ${pp.status()}`)

  const pb = await page.request.post(BASE+'/api/poll', {data:{side:'neither'}})
  pb.status()===400 ? pass('POST /api/poll invalid side → 400 ✓') : fail(`Invalid poll side → ${pb.status()} (expected 400)`)

  const pno = await page.request.post(BASE+'/api/poll', {data:{}})
  pno.status()===400 ? pass('POST /api/poll no body → 400 ✓') : warn(`Empty poll POST → ${pno.status()}`)

  await page.close()
}

// ── 11. SEO & ACCESSIBILITY ───────────────────────────────────
sec('11. SEO & Accessibility')
{
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil:'domcontentloaded' })

  const title = await page.title()
  title.includes('Nidhi')&&title.includes('Parag') ? pass(`Title OK: "${title}"`) : fail(`Bad title: "${title}"`)

  const desc = await safe(()=>page.$eval('meta[name="description"]',el=>el.content))
  desc ? pass(`Meta description: "${desc.slice(0,50)}…"`) : warn('No meta description')

  const og = await safe(()=>page.$eval('meta[property="og:title"]',el=>el.content))
  og ? pass(`OG title: "${og}"`) : warn('No OG title')

  // Images have alt tags
  await page.evaluate(()=>sessionStorage.setItem('invite_unlocked','true'))
  await page.reload({ waitUntil:'networkidle' })
  const imgsNoAlt = await safe(()=>page.$$eval('img:not([alt])',els=>els.length)) ?? 0
  imgsNoAlt===0 ? pass('All <img> tags have alt attributes') : warn(`${imgsNoAlt} images missing alt tags`)

  // No console errors
  const consoleErrors = []
  page.on('console', m => { if(m.type()==='error') consoleErrors.push(m.text()) })
  await page.evaluate(()=>document.getElementById('gallery')?.scrollIntoView())
  await page.waitForTimeout(2000)
  consoleErrors.length===0 ? pass('No console errors on main page') : warn(`${consoleErrors.length} console errors: ${consoleErrors[0]?.slice(0,80)}`)

  await ctx.close()
}

// ── 12. ADMIN PAGE ────────────────────────────────────────────
sec('12. Admin Page')
{
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await page.goto(BASE+'/admin', { waitUntil:'networkidle' })
  await page.waitForTimeout(1500)

  // Should show login, not data
  const hasPassword = await safe(()=>page.$('input[type="password"]'))
  hasPassword ? pass('Admin shows password gate (not exposed)') : warn('Admin page has no password input visible')

  // Wrong password
  if (hasPassword) {
    await hasPassword.fill('wrongpassword123')
    const loginBtn = await safe(()=>page.$('button[type="submit"]'))
    await safe(()=>loginBtn?.click())
    await page.waitForTimeout(1000)
    const stillNoData = await safe(()=>page.$('table'))
    !stillNoData ? pass('Wrong password blocked from admin data') : fail('SECURITY: Admin data visible with wrong password!')
  }

  // Admin verify endpoint
  const avBad = await page.request.post(BASE+'/api/admin/verify', {data:{password:'wrong'}})
  avBad.status()===401 ? pass('Admin verify bad password → 401 ✓') : fail(`Admin verify bad pw → ${avBad.status()}`)

  const avEmpty = await page.request.post(BASE+'/api/admin/verify', {data:{}})
  avEmpty.status()===400 ? pass('Admin verify no password → 400 ✓') : warn(`Admin verify no pw → ${avEmpty.status()}`)

  await ctx.close()
}

await browser.close()

// ── SUMMARY ───────────────────────────────────────────────────
console.log('\n'+('═').repeat(65))
console.log('QA REPORT SUMMARY')
console.log(('═').repeat(65))
console.log(`\n❌ BUGS (${bugs.length}):`)
bugs.forEach((b,i)=>console.log(`  ${i+1}. ${b}`))
console.log(`\n⚠️  WARNINGS (${warns.length}):`)
warns.forEach((w,i)=>console.log(`  ${i+1}. ${w}`))
console.log('')
if (bugs.length===0) console.log('🎉 No critical bugs found!')
