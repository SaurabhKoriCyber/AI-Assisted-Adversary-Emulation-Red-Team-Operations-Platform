import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { motion } from '@/design/tokens'

export const EASE_OUT = motion.easeOut
export const EASE_IO = motion.easeIO
export const useCalm = () => !!useReducedMotion()

/** Count-up with tabular figures; calm users get the final value. */
export function useCountUp(target: number, ms = 1400, decimals = 0) {
  const calm = useCalm()
  const [v, setV] = useState(calm ? target : 0)
  useEffect(() => {
    if (calm) { setV(target); return }
    let raf = 0; const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms)
      const e = 1 - Math.pow(1 - p, 4)
      setV(target * e)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms, calm])
  return v.toFixed(decimals)
}

export function useMedia(q: string) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && 'matchMedia' in window && window.matchMedia(q).matches)
  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return
    const mq = window.matchMedia(q); const f = () => setM(mq.matches)
    f(); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f)
  }, [q])
  return m
}

export function useInView<T extends Element>(rootMargin = '0px') {
  const ref = useRef<T>(null); const [v, setV] = useState(true)
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { rootMargin })
    io.observe(ref.current); return () => io.disconnect()
  }, [rootMargin])
  return [ref, v] as const
}
