import { useEffect, useRef, useState } from 'react'

export function useInView(threshold = 0.08, once = true) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) { setInView(true); return }

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight - 40) { setInView(true); return }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) obs.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return [ref, inView]
}

export function useCounter(target, duration = 1600, enabled = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!enabled) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p    = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setVal(Math.round(ease * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, enabled])
  return val
}

export function useParallax(speed = 0.3) {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const fn = () => setOffset(window.scrollY * speed)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [speed])
  return offset
}
