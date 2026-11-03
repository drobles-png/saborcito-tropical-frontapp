import { gsap } from 'gsap'

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Primer [data-cart-target] visible (el del header o el de la CartBar). */
function target(): HTMLElement | null {
  const all = Array.from(document.querySelectorAll<HTMLElement>('[data-cart-target]'))
  return (
    all.find((el) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight
    }) ?? null
  )
}

/** Un clon de la foto vuela en arco hasta el carrito. Devuelve cuando aterriza. */
export function flyToCart(img: HTMLElement | null | undefined): Promise<void> {
  const to = target()
  if (!img || !to || reduce()) return Promise.resolve()
  const from = img.getBoundingClientRect()
  const end = to.getBoundingClientRect()
  const size = Math.min(from.width, 140)

  const clone = img.cloneNode(true) as HTMLElement
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    margin: '0',
    borderRadius: '50%',
    objectFit: 'cover',
    background: '#fff',
    boxShadow: '0 12px 30px rgba(29,27,32,.25)',
    zIndex: '400',
    pointerEvents: 'none',
  })
  document.body.appendChild(clone)

  const dx = end.left + end.width / 2 - (from.left + from.width / 2)
  const dy = end.top + end.height / 2 - (from.top + from.height / 2)

  return new Promise((resolve) => {
    gsap
      .timeline({ onComplete: () => (clone.remove(), resolve()) })
      .to(clone, { scale: 1.12, duration: 0.15, ease: 'power2.out' })
      .to(clone, { x: dx, duration: 0.7, ease: 'power1.inOut' }, '>')
      // y en dos tramos = arco: sube primero y cae sobre el carrito
      .to(clone, { y: Math.min(dy, 0) - 80, duration: 0.3, ease: 'power2.out' }, '<')
      .to(clone, { y: dy, duration: 0.4, ease: 'power2.in' }, '>')
      .to(clone, { scale: 0.18, autoAlpha: 0.6, duration: 0.55, ease: 'power2.in' }, '<-0.15')
  })
}
