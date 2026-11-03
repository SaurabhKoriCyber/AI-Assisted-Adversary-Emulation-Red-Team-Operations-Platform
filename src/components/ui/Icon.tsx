import type { SVGProps } from 'react'

/** Bespoke icon set: 24 grid, 1.5px stroke, square caps, mitred joins. */
const P: Record<string, string> = {
  loop: 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4',
  command: 'M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 14h7v6H4z',
  ops: 'M3 6h18M3 12h12M3 18h7M18 15l3 3-3 3',
  path: 'M5 5h3v3H5zM16 4h3v3h-3zM10 16h3v3h-3zM8 7l8-1M17 7l-5 9M6 8l5 8',
  matrix: 'M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4z',
  planner: 'M4 5h16v14H4zM4 10h16M9 5v14',
  approval: 'M12 3l8 3v6c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5',
  telemetry: 'M3 12h4l2-6 4 12 2-6h6',
  vault: 'M4 4h16v16H4zM12 8v3m0 3v2M8 12h3m2 0h3',
  report: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7',
  billing: 'M3 7h18v10H3zM3 11h18M7 15h3',
  team: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M17 5a3 3 0 0 1 0 6M18 14c2 .6 3 2.700 3 6',
  plug: 'M9 3v5M15 3v5M6 8h12v4a6 6 0 0 1-12 0zM12 18v3',
  audit: 'M5 3h14v18H5zM9 8h6M9 12h6M9 16h3',
  settings: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',
  search: 'M10.5 17a6.500 6.500 0 1 0 0-13 6.500 6.500 0 0 0 0 13zM15.500 15.500L20 20',
  check: 'M5 12.500l4.500 4.500L19 7.500',
  x: 'M6 6l12 12M18 6L6 18',
  lock: 'M6 11h12v9H6zM8.500 11V8a3.500 3.500 0 0 1 7 0v3',
  hash: 'M9 4L7 20M17 4l-2 16M4 9h16M3.500 15h16',
  arrow: 'M4 12h15M13 6l6 6-6 6',
  chev: 'M9 6l6 6-6 6',
  play: 'M7 5l12 7-12 7z',
  pause: 'M7 5h3v14H7zM14 5h3v14h-3z',
  filter: 'M4 5h16l-6 8v6l-4-2v-4z',
  external: 'M8 16L18 6M9 6h9v9',
  plus: 'M12 5v14M5 12h14',
  alert: 'M12 4l9 16H3zM12 10v4M12 17v.5',
}
export type IconName = keyof typeof P
export function Icon({ name, size = 18, ...r }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" {...r}>
      <path d={P[name]} />
    </svg>
  )
}
export const Logo = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path d="M12 3a9 9 0 0 1 9 9" /><path d="M21 12a9 9 0 0 1-9 9" /><path d="M12 21a9 9 0 0 1-9-9" stroke="#C1121F" /><path d="M3 12a9 9 0 0 1 9-9" opacity=".35" />
  </svg>
)
