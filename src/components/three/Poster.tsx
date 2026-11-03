/** Static poster: used for reduced-motion, save-data, low-memory and no-WebGL clients. */
export function Poster({ className }: { className?: string }) {
  const N = 5, R = 150
  const seg = (i: number) => {
    const a0 = (i / N) * Math.PI * 2 + 0.06, a1 = ((i + 1) / N) * Math.PI * 2 - 0.06
    const p = (a: number, r: number) => `${200 + Math.cos(a) * r},${200 + Math.sin(a) * r}`
    return `M${p(a0, R + 26)} A${R + 26},${R + 26} 0 0 1 ${p(a1, R + 26)} L${p(a1, R - 26)} A${R - 26},${R - 26} 0 0 0 ${p(a0, R - 26)}Z`
  }
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="REDOPS closed-loop object: five machined segments with crimson seams" style={{ transform: 'perspective(900px) rotateX(52deg) rotateZ(-18deg)' }}>
      <defs>
        <linearGradient id="seg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#23262c" /><stop offset=".45" stopColor="#0b0c0f" /><stop offset="1" stopColor="#15181d" /></linearGradient>
      </defs>
      {Array.from({ length: N }, (_, i) => <path key={i} d={seg(i)} fill="url(#seg)" stroke="rgba(255,255,255,.12)" strokeWidth=".75" />)}
      {Array.from({ length: N }, (_, i) => { const a = (i / N) * Math.PI * 2; return <line key={i} x1={200 + Math.cos(a) * (R - 26)} y1={200 + Math.sin(a) * (R - 26)} x2={200 + Math.cos(a) * (R + 26)} y2={200 + Math.sin(a) * (R + 26)} stroke="#C1121F" strokeWidth="2" /> })}
    </svg>
  )
}
export function canRender3D() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (nav.connection?.saveData || (nav.deviceMemory && nav.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)) return false
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}
