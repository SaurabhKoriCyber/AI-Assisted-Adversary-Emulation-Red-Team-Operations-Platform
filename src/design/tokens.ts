/** Design tokens. Mirror of @theme in index.css, for JS consumers (R3F, charts, canvas). */
export const color = {
  ink: '#07080A', g1: '#0D0F12', g2: '#14171C', g3: '#1B1F26',
  bone: '#ECE9E2', mute: '#8A8D93',
  crimson: '#C1121F', crimsonInk: '#E5575E', teal: '#3FA7A0', amber: '#D9A441',
  line: 'rgba(255,255,255,0.07)',
} as const

export const space = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const
export const radius = { xs: 2, sm: 3, md: 4, lg: 6 } as const
export const type = {
  display: { family: "'Instrument Serif', serif", tracking: '-0.025em' },
  ui: { family: "'Inter Tight', sans-serif" },
  mono: { family: "'JetBrains Mono', monospace" },
  scale: [10.5, 12, 13, 14, 16, 20, 28, 40, 64, 112],
} as const
export const motion = {
  easeOut: [0.22, 1, 0.36, 1] as [number, number, number, number],
  easeIO: [0.65, 0, 0.35, 1] as [number, number, number, number],
  d: { fast: 0.4, base: 0.6, slow: 0.9 },
} as const
export const elevation = {
  1: 'inset 0 1px 0 rgba(255,255,255,.06), 0 1px 0 rgba(0,0,0,.6)',
  2: 'inset 0 1px 0 rgba(255,255,255,.06), 0 24px 48px -24px rgba(0,0,0,.8)',
} as const
