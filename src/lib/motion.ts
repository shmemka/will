// Спокойные анимации на всём сайте: скользящая черта у вкладок и мягкое появление блоков при прокрутке.
const TAB_GROUPS = '.tabs, .chips, .nav-main'
const ACTIVE = '.tab.active, .chip.active, .nav-link.active'
const REVEAL = 'main section ~ section, main .pcard, main .service, main .stat, main .guide-card, main .pkg, main .card-link'

function placeInk(group: HTMLElement) {
  let ink = group.querySelector<HTMLElement>(':scope > .tab-ink')
  const active = group.querySelector<HTMLElement>(ACTIVE)
  if (!ink) {
    ink = document.createElement('span')
    ink.className = 'tab-ink'
    ink.setAttribute('aria-hidden', 'true')
    group.appendChild(ink)
    group.classList.add('has-ink')
  }
  if (!active) {
    ink.style.opacity = '0'
    return
  }
  const first = !ink.dataset.placed
  if (first) ink.style.transition = 'none'
  const x = active.offsetLeft
  const y = active.offsetTop + active.offsetHeight - ink.offsetHeight
  ink.style.width = `${active.offsetWidth}px`
  ink.style.transform = `translate(${x}px, ${y}px)`
  ink.style.opacity = '1'
  if (first) {
    ink.dataset.placed = '1'
    void ink.offsetWidth
    ink.style.transition = ''
  }
}

let io: IntersectionObserver | null = null
function setupReveal(root: ParentNode) {
  if (!io) return
  const vh = window.innerHeight
  root.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
    if (el.dataset.rv) return
    el.dataset.rv = '1'
    const r = el.getBoundingClientRect()
    if (r.top < vh * 0.92) return // то, что уже на экране, не прячем
    const sibs = el.parentElement ? Array.from(el.parentElement.children) : []
    const i = Math.max(0, sibs.indexOf(el))
    el.style.setProperty('--rv-delay', `${Math.min(i % 4, 3) * 70}ms`)
    el.classList.add('rv')
    io!.observe(el)
  })
}

export function startMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduce && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('rv-in')
            io!.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )
  }
  let raf = 0
  const update = () => {
    raf = 0
    document.querySelectorAll<HTMLElement>(TAB_GROUPS).forEach(placeInk)
    setupReveal(document)
  }
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }
  new MutationObserver((list) => {
    // свои изменения (стили черты) не учитываем, чтобы не зациклиться
    if (list.every((m) => m.target instanceof HTMLElement && m.target.classList.contains('tab-ink'))) return
    schedule()
  }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] })
  window.addEventListener('resize', schedule)
  document.fonts?.ready.then(schedule)
  schedule()
}
